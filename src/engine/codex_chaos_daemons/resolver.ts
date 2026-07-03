import type { FactionResolverFn } from '../resolver';
import { findArmoryItem } from '../resolver';
import { effectiveArchetypeFor, resolveUnit } from '../points';

export const SACRED_NUMBERS: Record<string, number> = {
  Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9,
};

export const cdResolve: FactionResolverFn = (base, item, unit, state, data) => {
  // ── Favored Units ────────────────────────────────────────────────────────────
  // A unit is Favored when its size is a multiple of the mark's sacred number AND
  // it has a "squad leader" model to receive the +1 Attack/personal icon (a second
  // model entry, e.g. Bloodreaper/Bloodhunter — see chaos_daemons.md §4e). Nurglings
  // is a single-model "Mindless"/"Swarm" entry with no such leader profile, so it
  // cannot be Favored — same pattern as CSM's Poxwalkers (codex_csm/resolver.ts).
  const isFavored =
    !!base.effectiveMark &&
    base.effectiveMark !== 'Undivided' &&
    SACRED_NUMBERS[base.effectiveMark] != null &&
    item.size > 0 &&
    item.size % SACRED_NUMBERS[base.effectiveMark] === 0 &&
    unit.models.length > 1;

  const injectedAbilities = [...base.injectedAbilities];
  const injectedRuleNotes = [...base.injectedRuleNotes];

  // Favored: auto-grant Personal Icon to squad leader
  if (isFavored) {
    injectedAbilities.push(
      'Personal Icon (Favored): Daemon units deep striking within 3″ of this unit\'s squad leader do not scatter. Same-mark units may instead deploy within 6″.',
    );
  }
  const isVeh     = unit.is_vehicle;
  const isChar    = unit.is_character;
  const isMonster = unit.is_monster;

  // ── Ascended Daemon Prince ────────────────────────────────────────────────────
  // When the variant is active the DP moves from Heavy Support → HQ and gains
  // several rule changes (already reflected in the variant model's stats/abilities).
  let effectiveSlot = base.effectiveSlot;
  if (
    base.effectiveSlot === 'Heavy Support' &&
    base.variantActive &&
    base.variant?.name === 'Ascended Daemon Prince'
  ) {
    effectiveSlot = 'HQ';
    injectedRuleNotes.push(
      'Ascended: uses HQ slot (highest-pts HQ for Animosity), has all Marks, Greater Daemon, Fearless, Terrifying(−2)',
    );
  }

  // ── Mark ability injection ───────────────────────────────────────────────────
  // Only for units that CHOOSE their mark (Daemon Prince, Soul Grinder, Daemon Brutes).
  // statModMark is null for locked-mark units — their benefits are already in their profile.
  if (base.statModMark) {
    switch (base.statModMark) {
      case 'Tzeentch':
        if (isVeh) {
          injectedAbilities.push('Mark of Tzeentch: Gains a Warpflamer (9″ Assault4 S4 AP−1)');
        } else {
          if (!unit.abilities.some(a => a.toLowerCase().includes('warded'))) {
            injectedAbilities.push('Warded');
          }
          if (isChar || isMonster) {
            if (base.effectivePsyker) {
              injectedAbilities.push('Mark of Tzeentch: +1 power to manifest and deny per turn');
            } else {
              injectedAbilities.push('Mark of Tzeentch: Becomes a Psyker — knows 1 power from any discipline');
            }
          }
        }
        break;
      case 'Khorne':
        if (isVeh) {
          injectedAbilities.push('Mark of Khorne: Tank Shock causes double hits');
        } else {
          injectedAbilities.push('Mark of Khorne: +1 Attack');
          if (isChar || isMonster) injectedAbilities.push('Mark of Khorne: +1 Strength');
        }
        break;
      case 'Nurgle':
        if (isVeh) {
          injectedAbilities.push('Mark of Nurgle: Recover damage during Reinforce (2D6, 7+)');
        } else {
          injectedAbilities.push('Mark of Nurgle: +1 Toughness');
          if (isChar || isMonster) injectedAbilities.push('Mark of Nurgle: +1 Wound');
        }
        break;
      case 'Slaanesh':
        if (isVeh) {
          injectedAbilities.push('Mark of Slaanesh: Enemy units within 18″ suffer -1 Leadership (−2 within 9″)');
        } else {
          injectedAbilities.push('Mark of Slaanesh: +1 Initiative');
          if (isChar || isMonster) injectedAbilities.push('Mark of Slaanesh: +2″ Movement');
        }
        break;
    }
  }

  // ── Archetype effect notes ────────────────────────────────────────────────────
  // Archetype names include god superscripts (ˢ/ᴷ/ᵀ/ᴺ) — must match JSON keys exactly.
  switch (effectiveArchetypeFor(item, state)) {
    case 'Figureheads of The Dark Princeˢ':
      // HQ units get +1 Attack while not within 12" of another friendly HQ
      if (effectiveSlot === 'HQ') {
        injectedRuleNotes.push('Figureheads: +1 Attack while not within 12″ of another friendly HQ');
      }
      break;

    case 'Goretideᴷ':
      // Roll 1D6 on death in melee; on 5+ causes automatic Wound with one of their weapons
      injectedRuleNotes.push('Goretide: on death in melee, roll 1D6 — on a 5+ cause 1 automatic Wound (one of this unit\'s weapons) against an enemy in base contact');
      break;

    case 'Popping Plagueᴺ':
      // All units explode on death like a vehicle
      injectedRuleNotes.push('Popping Plague: explodes on death (roll as vehicle explosion)');
      break;

    case 'Host Duplicitousᵀ':
      // Psykers only: no increased cast value for repeating same power
      // Use base.effectivePsyker to include units that bought the optional psyker upgrade
      if (base.effectivePsyker) {
        injectedRuleNotes.push('Host Duplicitous: psychic powers do not increase their casting values for being manifested multiple times per round');
      }
      break;
  }

  // ── Locus auras (joined Herald → attached unit) ──────────────────────────────
  // Every god Herald's "Locus of X" ability (Bloodmaster/Poxbringer/Tranceweaver/Changecaster)
  // plus Sloppity Bilepiper's "Disease of Mirth" reads "The model AND ITS ATTACHED UNIT
  // gain/get/can ..." — verbatim datasheet text, but the engine only ever surfaced it on the
  // Herald's own card, never on the unit it joins. Mirrors the CSM "Zombie lord" fix
  // (codex_csm/resolver.ts) but generic: find whoever is joined to THIS entry and relay any of
  // its "attached unit" abilities here, verbatim (no rule-text synthesis — just relabelled).
  const joiner = state.army.find(e => e.joinedToUnit === item.id);
  const joinerUnit = joiner ? resolveUnit(joiner, data) : null;
  if (joinerUnit) {
    for (const a of joinerUnit.abilities ?? []) {
      if (/\battached unit\b/i.test(a)) {
        injectedAbilities.push(`(from attached ${joinerUnit.name}) ${a}`);
      }
    }
    // Same "attached unit" wording also appears on 4 General Armoury items (Cloud of flies,
    // Spiked Armor, Thrill Seeker, Unbound fury) — each priced for either a unit buying it for
    // itself (p_unit) or a Character buying it to buff whatever it joins (p_char). The joiner is
    // a Character by definition (only Characters can join), so any such item in their own
    // armory relays here the same way the datasheet Loci do above.
    // When the joiner is an allied unit (e.g. a CD Herald in a CSM+CD army), look up its armory
    // items in its own faction's data — `data` here is the PRIMARY faction's FactionData, so a
    // direct `findArmoryItem(data, sel)` would search the wrong armory and silently return undefined.
    const joinerArmoryData = joiner!.factionSource
      ? ((data.allied?.[joiner!.factionSource] ?? data) as typeof data)
      : data;
    for (const sel of joiner!.armory ?? []) {
      const armItem = findArmoryItem(joinerArmoryData, sel);
      if (armItem?.desc && /\battached unit\b/i.test(armItem.desc)) {
        injectedAbilities.push(`(from attached ${joinerUnit.name}) ${armItem.desc}`);
      }
    }
  }

  // ── Entourage / Herald / Bound Beast ─────────────────────────────────────────
  // Slot adjustments are handled in validators.ts (computeCdFreeSlots) and
  // SlotPanel.tsx — they affect the slot *count* seen by the engine, not the
  // unit's own profile, so no per-unit injection is needed here.

  return { ...base, effectiveSlot, isFavored, injectedAbilities, injectedRuleNotes };
};
