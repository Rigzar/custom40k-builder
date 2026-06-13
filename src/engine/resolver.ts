import type { Unit, Model, Weapon, ArmoryItem, FactionData, OptionCondition, OptionEffect } from '../types/data';
import type { RosterEntry, ArmyState, Mark, ArmorySelection } from '../types/army';
import type { EquipMods } from './equipMods';
import { computeUnitPoints, getActiveVariant, getPromotedModel } from './points';
import { getArchetypeRule, getEffectiveSlot } from './archetypes';
import { parseEquipMods, isWeaponTrait, extractWeaponGains, isGrantWeapon, extractGrantedWeaponName } from './equipMods';
import { getTraitEffects } from './traitEffects';
import { csmResolve } from './codex_csm/resolver';
import { cdResolve } from './resolvers/chaos_daemons';
import { smResolve } from './resolvers/space_marines';

// ── Output type ───────────────────────────────────────────────────────────────

export interface ResolvedProfile {
  pts: number;
  effectiveSlot: string;

  // Mark
  effectiveMark: Mark | null;
  markIsForced: boolean;
  markIsLocked: boolean;
  statModMark: Mark | null;
  markUsesVetSlot: boolean;
  vetMax: number;

  // Models
  variant: Model | null;
  variantActive: boolean;
  modelsToShow: Model[];
  squadLeaderIdx: number;

  // Psyker
  isTzeentchPsyker: boolean;
  isOptionalPsyker: boolean;
  psykerGroupIdx: number;
  effectivePsyker: boolean;

  // Display
  isFavored: boolean;
  /** True when unit.has_veteran_abilities OR archetype.grantVetAbilities includes this unit. */
  effectiveHasVetAbilities: boolean;
  equippedWith: string;
  weapons: Weapon[];
  /**
   * The weapons to actually display: built-in gear plus only the optional/choice
   * weapons that were selected. A weapon that also appears as a choice in an option
   * group is "optional" and is hidden until picked. Computed once here so UnitCard
   * and PrintView render identical lists.
   */
  weaponsToShow: Weapon[];
  weaponTraitMap: Map<string, string[]>;
  /** Mark-derived ability injections (e.g. Warded, Warpflamer) — shown with "Mark" badge. */
  injectedAbilities: string[];
  /** Archetype / variant rule notes (e.g. Ascended DP, Goretide) — shown with "Rule" badge. */
  injectedRuleNotes: string[];
  equipMods: EquipMods;

  // Trait effects
  traitStatMods: Array<{ stat: string; delta: number }>;
  traitAbilities: Array<{ traitName: string; name: string; desc?: string }>;
  traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }>;

  /** True when this HQ is the Black Crusade champion bearing all four Chaos god marks. */
  blackCrusadeChampion: boolean;

  // Option effects (ki-parser-02) — stat/type/ability changes a selected wargear option confers.
  /** Stat deltas from selected options (e.g. Daemon Prince wings M +6), stacked over base. */
  optionStatMods: Array<{ stat: string; delta: number }>;
  /** Unit types ADDED by selected options (additive), e.g. "Jump pack infantry". */
  optionAddedUnitTypes: string[];
  /** Unit-type line REPLACED by a selected option (datasheet "change type to X"); null if none. */
  optionSetUnitType: string | null;
  /** Special rules granted by selected options (e.g. "Deep strike") — shown with "Option" badge. */
  optionAbilities: string[];
}

// ── Shared utility ────────────────────────────────────────────────────────────

export function findArmoryItem(data: FactionData, sel: ArmorySelection): ArmoryItem | undefined {
  const section = sel.section as keyof typeof data.armory_general;
  const sources = [
    data.armory_general,
    ...Object.values(data.armory_marks),
    ...Object.values(data.armory_legions),
  ];
  for (const armory of sources) {
    const found = (armory[section] as ArmoryItem[]).find(a => a.name === sel.itemName);
    if (found) return found;
  }
  return undefined;
}

/** True when the unit carries the given keyword (its Chaos Mark or any datasheet keyword). */
function unitHasKeyword(keyword: string, mark: string | null, keywords: string[]): boolean {
  const kw = keyword.toLowerCase();
  if ((mark ?? '').toLowerCase() === kw) return true;
  return keywords.some(k => {
    const lk = k.toLowerCase();
    return lk === kw || lk === `mark of ${kw}`;
  });
}

/**
 * Evaluate a BSData-style availability condition (see OptionCondition). Returns whether the
 * option group is available.
 *   scope 'unit'           → match the keyword against the model's own mark / keywords.
 *   scope 'force'|'roster' → match against the host army's faction (e.g. a Horus Heresy unit
 *                            injected into a "Chaos Space Marines" vs "Space Marines" host).
 * The faction match is exact (case-insensitive) so "Space Marines" does not match the
 * "Chaos Space Marines" host.
 */
export function isOptionAvailable(
  cond: OptionCondition | undefined,
  mark: string | null,
  keywords: string[],
  hostFaction?: string | null,
): boolean {
  if (!cond) return true;
  const has = cond.scope === 'unit'
    ? unitHasKeyword(cond.keyword, mark, keywords)
    : (hostFaction ?? '').toLowerCase() === cond.keyword.toLowerCase();
  return cond.type === 'instanceOf' ? has : !has;
}

/**
 * Filter a weapon list down to what should be displayed: drop optional/choice
 * weapons that were not selected. A weapon counts as optional when it also appears
 * as a choice in some option group; built-in gear (not in any group) is always shown.
 */
export function computeWeaponsToShow(weapons: Weapon[], unit: Unit, item: RosterEntry): Weapon[] {
  // Multi-profile weapons are stored as several entries named "<Weapon> - <Profile>"
  // (e.g. "Plasma blastgun - Rapid"). An option choice names the parent weapon ("Plasma
  // blastgun"), so match a choice against the weapon name BEFORE the " - " profile suffix.
  const baseName = (n: string) => n.split(' - ')[0];
  const optionalWeaponNames = new Set<string>();
  for (const g of unit.option_groups) {
    for (const c of g.choices) {
      if (unit.weapons.some(w => baseName(w.name) === c.name)) optionalWeaponNames.add(c.name);
    }
  }
  const hasReplaceGroup = unit.option_groups.some(g => g.replaces && g.replaces.length > 0);
  if (optionalWeaponNames.size === 0 && !hasReplaceGroup) return weapons;

  const selectedWeaponNames = new Set<string>();
  // Weapons dropped by a structured `replace` group whose swap affects the whole unit.
  const replacedWeaponNames = new Set<string>();
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    const hasSelection = Object.entries(ch).some(([ci, qty]) => ci !== '__inline' && !!qty);
    // `replaces` is set in the data ONLY for unit-wide swaps ("Each model's X" / "May replace
    // its X"). Subset swaps ("one model's X", per_n/fixed_max) leave it unset so both the old
    // and new weapons stay on the datasheet. So: drop whenever the group is tagged + selected.
    if (hasSelection && g.replaces) {
      for (const name of g.replaces) replacedWeaponNames.add(name);
    }
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice && optionalWeaponNames.has(choice.name)) selectedWeaponNames.add(choice.name);
    }
  }
  return weapons.filter(w =>
    !replacedWeaponNames.has(w.name) &&
    (!optionalWeaponNames.has(baseName(w.name)) || selectedWeaponNames.has(baseName(w.name))),
  );
}

// ── Generic base resolver ─────────────────────────────────────────────────────

function resolveBase(item: RosterEntry, unit: Unit, state: ArmyState, data: FactionData): ResolvedProfile {
  const rule = getArchetypeRule(state.archetype);

  // Points & slot
  const pts = computeUnitPoints(item, unit, state.archetype);
  const effectiveSlot = getEffectiveSlot(item.unitName, item.slot, rule);

  // Variant model
  const activeVariant = getActiveVariant(item, unit);
  const variant = activeVariant?.variant ?? null;
  const variantActive = !!activeVariant;

  // Mark resolution
  const effectiveMark = (unit.locked_mark ?? (rule?.forcedMark as Mark | null) ?? item.mark) as Mark | null;
  const markIsForced = !unit.locked_mark && !!rule?.forcedMark;
  const markIsLocked = !!unit.locked_mark;
  const statModMark = unit.locked_mark
    ? null
    : (item.mark ?? (markIsForced ? ((rule!.forcedMark as Mark) ?? null) : null)) as Mark | null;
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark');
  // The four god marks count as a veteran ability. Mark of Chaos Undivided does NOT (rule omits the clause).
  // Locked-mark units (e.g. Plague Marines) use veteran_max:1 in their data instead.
  const markUsesVetSlot = hasMarkGroup && !unit.locked_mark && !!effectiveMark && effectiveMark !== 'Undivided';
  const vetMax = Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0));
  const effectiveHasVetAbilities = unit.has_veteran_abilities || !!(rule?.grantVetAbilities?.includes(item.unitName));

  // Models to display — variant replaces the model group it's promoted from (derived from
  // the option group's own wording, since that group isn't always last in unit.models —
  // e.g. Traitor Guard's Traitor Sergeant promotes a Guardsman, but Ogryn is listed last).
  const visibleModels = unit.models.filter(m => m.max > 0);
  const modelsToShow: Model[] = activeVariant
    ? (() => {
        const promoted = getPromotedModel(unit, activeVariant);
        const idx = visibleModels.indexOf(promoted);
        return idx >= 0
          ? visibleModels.map((m, i) => i === idx ? activeVariant.variant : m)
          : [...visibleModels.slice(0, -1), activeVariant.variant];
      })()
    : visibleModels;
  const squadLeaderIdx = modelsToShow.length <= 1 ? 0 : (() => {
    const idx = modelsToShow.findIndex(m => m.min === 0);
    return idx >= 0 ? idx : modelsToShow.length - 1;
  })();

  // Psyker flags
  const psykerGroupIdx = unit.option_groups.findIndex(
    g => /psyker/i.test(g.header) && g.inline_pts != null,
  );
  const isOptionalPsyker = !unit.is_psyker && psykerGroupIdx >= 0 &&
    (item.optionQty[psykerGroupIdx]?.['__inline'] ?? 0) > 0;
  const isTzeentchPsyker = unit.is_character && !unit.is_psyker && statModMark === 'Tzeentch';
  const effectivePsyker = unit.is_psyker || isTzeentchPsyker || isOptionalPsyker;

  // Weapons & loadout (unmodified — faction resolvers apply overrides)
  const equippedWith = unit.equipped_with ?? '';
  const weapons: Weapon[] = [...unit.weapons];

  // Weapon-targeting daemon weapon traits
  const weaponTraitMap = new Map<string, string[]>();
  for (const sel of item.armory) {
    if (sel.section !== 'daemon_weapons' || !sel.targetWeapon) continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isWeaponTrait(armItem.desc)) continue;
    const gains = extractWeaponGains(armItem.desc);
    if (gains.length > 0) {
      weaponTraitMap.set(sel.targetWeapon, [...(weaponTraitMap.get(sel.targetWeapon) ?? []), ...gains]);
    }
  }

  // NOTE: global trait weapon abilities are injected into weaponTraitMap after traitWeaponAbilities
  // is populated below (see "Inject global trait weapon abilities" comment).

  // Items that GRANT a new weapon to the model — daemon weapons and vehicle upgrades.
  // Patterns: "The model gains the 'X' weapon" (Kai), "The model gains a X" (Hunter-killer missile).
  // The granted weapon is looked up in the armory general weapons list.
  for (const sel of item.armory) {
    if (sel.section !== 'daemon_weapons' && sel.section !== 'equipment') continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isGrantWeapon(armItem.desc)) continue;
    const grantedName = extractGrantedWeaponName(armItem.desc);
    if (!grantedName) continue;
    // Find the weapon profile in armory_general.weapons
    const granted = (data.armory_general.weapons as import('../types/data').ArmoryItem[])
      .find(w => w.name.toLowerCase() === grantedName.toLowerCase());
    if (granted && !weapons.find(w => w.name === granted.name)) {
      weapons.push({
        name: granted.name,
        range: granted.range ?? '',
        type: granted.type ?? '',
        s: granted.s ?? '',
        ap: granted.ap ?? '',
        d: granted.d ?? '',
        abilities: granted.abilities ?? '-',
      });
    }
  }

  // Equipment mods
  const equipItems = item.armory
    .filter(a => {
      const ai = findArmoryItem(data, a);
      if (a.section === 'daemon_weapons') return !isWeaponTrait(ai?.desc) && !isGrantWeapon(ai?.desc);
      if (a.section === 'equipment') return !isGrantWeapon(ai?.desc); // exclude weapon-granting upgrades
      return false;
    })
    .map(a => {
      const found = findArmoryItem(data, a);
      return { name: a.itemName, desc: found?.desc ?? '', armourKeyword: found?.armourKeyword };
    });
  const equipMods: EquipMods = parseEquipMods(equipItems, unit.armourKeyword, unit.abilities);

  // Trait effects
  // CSM army traits only apply to models with the "Chaos Space Marine" keyword.
  // Subfaction units (World Eaters, Death Guard, Thousand Sons, Emperor's Children) are excluded.
  const isMainFaction = item.unitName in data.units;
  const hasCSMKeyword = unit.keywords?.includes('Chaos Space Marine') ?? false;
  const traitsApply = isMainFaction && (data.faction !== 'Chaos Space Marines' || hasCSMKeyword);
  const traitStatMods: Array<{ stat: string; delta: number }> = [];
  const traitAbilities: Array<{ traitName: string; name: string; desc?: string }> = [];
  const traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }> = [];
  if (traitsApply && item.traits.length > 0) {
    for (const t of item.traits) {
      for (const e of getTraitEffects(t.name, unit)) {
        if (e.type === 'stat_mod')      traitStatMods.push({ stat: e.stat, delta: e.delta });
        else if (e.type === 'inv_save') traitAbilities.push({ traitName: t.name, name: `${e.value}+ Invulnerability Save` });
        else if (e.type === 'unit_ability')   traitAbilities.push({ traitName: t.name, name: e.name, desc: e.desc });
        else if (e.type === 'weapon_ability') traitWeaponAbilities.push({ traitName: t.name, name: e.name, weapon_type: e.weapon_type });
      }
    }
  }

  // Inject global trait weapon abilities into weaponTraitMap so the WeaponTable shows them
  // directly on each weapon row (e.g. Siege Experts → Sunder(1) on every ranged weapon).
  if (traitWeaponAbilities.length > 0) {
    for (const weapon of unit.weapons) {
      const isMelee = weapon.range === '-' || /^melee/i.test(weapon.type ?? '');
      for (const wa of traitWeaponAbilities) {
        const applies =
          !wa.weapon_type ||
          (wa.weapon_type === 'melee'   &&  isMelee) ||
          (wa.weapon_type === 'ranged'  && !isMelee) ||
          (wa.weapon_type === 'bolt'    && /bolt/i.test(weapon.name) && !/^heavy/i.test(weapon.type ?? ''));
        if (applies) {
          weaponTraitMap.set(weapon.name, [...(weaponTraitMap.get(weapon.name) ?? []), wa.name]);
        }
      }
    }
  }

  // Equipment items that grant weapon abilities globally: "All ranged/melee/all weapons gain 'X'."
  // Detected via desc text — same injection mechanism as trait weapon abilities above.
  // This covers: Plague ammunition (Poison), Seeking rounds (Anti-Air), Soul Burn swords, etc.
  // Pattern: All (ranged|melee|bolt)? weapons ... gain ['"]ABILITY['"]
  for (const sel of item.armory) {
    if (sel.section !== 'equipment') continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc) continue;
    const desc = armItem.desc;
    // Match "All [type] weapons ... gain 'X'" or "All [type] weapons ... gain "X""
    const m = desc.match(/\bAll\s+(ranged|melee|bolt|arc|rad|heavy)?\s*weapons?\b.*\bgain\b.*?["']([^"']+)["']/i);
    if (!m) continue;
    const rawType = (m[1] ?? '').toLowerCase();
    const ability = m[2];
    const wtype = rawType === 'ranged' ? 'ranged'
      : rawType === 'melee' ? 'melee'
      : rawType === 'bolt' ? 'bolt'
      : undefined; // 'all' or unspecified → applies to all weapons
    for (const weapon of unit.weapons) {
      const isMelee = weapon.range === '-' || /^melee/i.test(weapon.type ?? '');
      const applies =
        !wtype ||
        (wtype === 'melee'  &&  isMelee) ||
        (wtype === 'ranged' && !isMelee) ||
        (wtype === 'bolt'   && /bolt/i.test(weapon.name + ' ' + (weapon.type ?? '')));
      if (applies) {
        weaponTraitMap.set(weapon.name, [...(weaponTraitMap.get(weapon.name) ?? []), ability]);
      }
    }
  }

  const blackCrusadeChampion = !!(item.blackCrusadeHQ);

  // Collect abilities from selected choices that have their own abilities array
  const choiceAbilities: string[] = [];
  // Option effects (ki-parser-02): stat/type/ability changes from selected wargear options.
  const optionStatMods: Array<{ stat: string; delta: number }> = [];
  const optionAddedUnitTypes: string[] = [];
  let optionSetUnitType: string | null = null;
  const optionAbilities: string[] = [];
  // De-dup helpers: an effect only grants what the model doesn't already have (a type/ability
  // already in its base profile is not re-added). Normalize so "Deepstrike" matches "Deep strike".
  const _norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const _baseTypeNorm = _norm(unit.unit_type);
  const _baseAbilNorm = (unit.abilities ?? []).flatMap(a => a.split(/[,;]/)).map(p => _norm(p.split(':')[0]));
  const applyEffect = (eff: OptionEffect | undefined) => {
    if (!eff) return;
    for (const sm of eff.stat_mod ?? []) optionStatMods.push({ stat: sm.stat, delta: sm.delta });
    for (const t of eff.adds_unit_types ?? [])
      if (!optionAddedUnitTypes.includes(t) && !_baseTypeNorm.includes(_norm(t))) optionAddedUnitTypes.push(t);
    if (eff.set_unit_type) optionSetUnitType = eff.set_unit_type;
    for (const ab of eff.grants_abilities ?? [])
      if (!optionAbilities.includes(ab) && !_baseAbilNorm.includes(_norm(ab))) optionAbilities.push(ab);
  };
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    const hasAnySelection = Object.entries(ch).some(([ci, qty]) => (ci === '__inline' || !!qty) && !!qty);
    // Group-level effect applies whenever the group has a selection (covers inline toggles).
    if (hasAnySelection) applyEffect(g.effect);
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice?.abilities?.length) {
        for (const ab of choice.abilities) {
          if (!choiceAbilities.includes(ab)) choiceAbilities.push(ab);
        }
      }
      applyEffect(choice?.effect);
    }
  }
  // Armory-item effects: a bought item may confer a UNIT-TYPE change ("Chaos Space Marine bike" →
  // "Bike"; "Daemonic stature" → "Monstrous Infantry"). Stats and quoted abilities for these items
  // still come from equipMods; this only adds the type, de-duplicated against what the model has.
  for (const sel of item.armory) {
    const ai = findArmoryItem(data, sel);
    if (ai?.effect) applyEffect(ai.effect);
  }

  // Core Rules "Objective secured!" (L1320-1322, "Automatic Rule"): automatically conferred
  // to every Troop selection; units gain/lose it if their battlefield role switches via
  // Archetypes — `effectiveSlot` already reflects archetype slot-shifts (getEffectiveSlot),
  // so checking it here covers that clause for free. Allied-detachment units NEVER get it
  // (Allies section, L1833) — gated on factionSource matching the active allied faction
  // (NOT on factionSource alone: injected-supplement units like Assassins/HH carry their own
  // factionSource without being an "allied detachment" in the rules sense).
  const isAlliedDetachmentUnit = !!(state.alliedFaction && item.factionSource === state.alliedFaction);
  const ruleNotes: string[] = [];
  if (effectiveSlot === 'Troops' && !isAlliedDetachmentUnit) {
    ruleNotes.push('Objective secured!');
  }

  return {
    pts, effectiveSlot,
    effectiveMark, markIsForced, markIsLocked, statModMark, markUsesVetSlot, vetMax,
    variant, variantActive, modelsToShow, squadLeaderIdx,
    isTzeentchPsyker, isOptionalPsyker, psykerGroupIdx, effectivePsyker,
    isFavored: false,
    effectiveHasVetAbilities,
    equippedWith, weapons, weaponsToShow: weapons, weaponTraitMap,
    injectedAbilities: choiceAbilities,
    injectedRuleNotes: ruleNotes,
    equipMods,
    traitStatMods, traitAbilities, traitWeaponAbilities,
    blackCrusadeChampion,
    optionStatMods, optionAddedUnitTypes, optionSetUnitType, optionAbilities,
  };
}

// ── Faction resolver registry ─────────────────────────────────────────────────

export type FactionResolverFn = (
  base: ResolvedProfile,
  item: RosterEntry,
  unit: Unit,
  state: ArmyState,
  data: FactionData,
) => ResolvedProfile;

const FACTION_RESOLVERS: Partial<Record<string, FactionResolverFn>> = {
  'Chaos Space Marines': csmResolve,
  'Chaos Daemons':       cdResolve,
  'Space Marines':       smResolve,
};

// ── Public API ────────────────────────────────────────────────────────────────

export function resolveUnitProfile(
  item: RosterEntry,
  unit: Unit,
  state: ArmyState,
  data: FactionData,
): ResolvedProfile {
  const base = resolveBase(item, unit, state, data);
  const factionFn = FACTION_RESOLVERS[state.faction];
  const profile = factionFn ? factionFn(base, item, unit, state, data) : base;
  // Faction resolvers may rewrite `weapons`; derive the display list from the final set.
  profile.weaponsToShow = computeWeaponsToShow(profile.weapons, unit, item);
  return profile;
}
