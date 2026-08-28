import type { Unit, Model, Weapon, ArmoryItem, FactionData, OptionCondition, OptionEffect, DroneType } from '../types/data';
import type { RosterEntry, ArmyState, Mark, ArmorySelection } from '../types/army';
import type { EquipMods } from './equipMods';
import { computeUnitPoints, getActiveVariant, getPromotedModel, effectiveArchetypeFor } from './points';
import { getArchetypeRule, getEffectiveSlot } from './archetypes';
import { applyPlatoonSlotOverride } from './codex_imperial_guard/platoon';
import { parseEquipMods, isWeaponTrait, extractWeaponGains, isGrantWeapon, extractGrantedWeaponName, weaponCopiesPerModel } from './equipMods';
import { mergeWeaponAbilities } from './abilityMerge';
import { getTraitEffects } from './traitEffects';
import { effectiveSubfactions, traitRequiredSubfaction } from './codex_dark_eldar/subfaction';
import { getCombatDrug } from './codex_dark_eldar/combatDrugs';
import { csmResolve } from './codex_csm/resolver';
import { cdResolve } from './codex_chaos_daemons/resolver';
import { smResolve } from './codex_space_marines/resolver';
import { admechResolve } from './codex_adeptus_mechanicus/resolver';

// ── Output type ───────────────────────────────────────────────────────────────

export interface WeaponGroup {
  /** Model-group name (e.g. "Traitor Guardsman", "Chaos Ogryn", or a built-in Champion's
   * name); null when the unit has only one weapon group. */
  label: string | null;
  /** "[N]x" prefix to show for every weapon in this group; null = no prefix. */
  count: number | null;
  weapons: Weapon[];
  /** Weapon-ability injections to apply when rendering this group's rows; defaults to the
   * profile's overall weaponTraitMap when absent (set when a group needs its own, e.g. a
   * Character-only daemon weapon trait that only modifies the Champion's copy). */
  traitMap?: Map<string, string[]>;
  /**
   * The model rows this group covers, set ONLY when one loadout clause spans several of them
   * ("Every Jakhal and Jakhal Pack Leader is equipped with:" — also Voidscarred and Kroot
   * Farstalkers, and nothing else in the game). A swap group scoped with `applies_to_model:
   * "Jakhal"` has to recognise that this row contains Jakhals; matching on the label alone never
   * did, so the swap was counted against nothing and the Chainblade total never dropped.
   */
  models?: string[];
  /** Per-weapon-name count override, keyed by exact weapon name — takes priority over `count`
   * for that one row. Set when independent option groups (e.g. "every model's Lasgun may be
   * replaced" + a separate "per 10 models, one Lasgun may become a Flamer") let only a SUBSET
   * of this group's models take a swap, so the base weapon and the swapped-in weapon each need
   * their own count instead of sharing the group's full model count. */
  countOverrides?: Map<string, number>;
}

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
  /** Per-entry count to show as an "Nx" prefix alongside the model name; null = no prefix
   * (single/fixed model). Set when a promotion (e.g. Traitor Sergeant) splits the base
   * model's count from the promoted variant — parallel array to modelsToShow. */
  modelCounts: (number | null)[];
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
  /** Archetype-driven cosmetic rename/ability-injection (e.g. Plaguehost's "Combi-flamer" →
   * "Combi-plague belcher" + Poison) applied AFTER computeWeaponsToShow's gating, never before —
   * gating matches choice names against the unit's ORIGINAL weapon names, so renaming first would
   * break the match and leave the weapon either always-shown or always-hidden. Used both for the
   * live equipped-weapons list and the option-picker's per-choice weapon rows. */
  weaponDisplayOverride?: (weapons: Weapon[]) => Weapon[];
  /**
   * The weapons to actually display: built-in gear plus only the optional/choice
   * weapons that were selected. A weapon that also appears as a choice in an option
   * group is "optional" and is hidden until picked. Computed once here so UnitCard
   * and PrintView render identical lists.
   */
  weaponsToShow: Weapon[];
  /**
   * weaponsToShow split into per-model-group tables (e.g. Traitor Guardsman vs Chaos Ogryn,
   * or a built-in Champion's Armory-bought weapons kept out of the squad's shared table).
   * `label`/`count` are null when there's only one group, so single-group units render
   * identically to a flat weaponsToShow list.
   */
  weaponGroups: WeaponGroup[];
  /** Names of weapons added to `weapons` via an Armory item that "grants" a weapon
   * (daemon weapons, Hunter-killer missile, etc.) — used to route them into the
   * built-in Champion's own weapon group when the unit gates Armory access to them. */
  armoryGrantedWeapons: string[];
  weaponTraitMap: Map<string, string[]>;
  /** Like weaponTraitMap, but for Character-only (p_char-priced) daemon weapon traits on a
   * squad that has a built-in Champion/Sergeant — these modify only the Champion's personal
   * copy of the named weapon, not every copy the squad carries. Applied by computeWeaponGroups
   * to the Champion's weapon group only. */
  championWeaponTraitMap: Map<string, string[]>;
  /** Mark-derived ability injections (e.g. Warded, Warpflamer) — shown with "Mark" badge. */
  injectedAbilities: string[];
  /** Archetype / variant rule notes (e.g. Ascended DP, Goretide) — shown with "Rule" badge. */
  injectedRuleNotes: string[];
  equipMods: EquipMods;
  /** Stat/save mods from a Trait's `grant_armory_item` effect (IG "Heavy Infantry" → Plate
   *  armor), kept separate from `equipMods` so the UI can apply them to every model row instead
   *  of gating them to the Champion/promoted-variant row the way a real per-model Armory
   *  purchase is gated (ki-ig-heavy-infantry-trait-champion-only-01). */
  traitEquipMods: EquipMods;

  // Trait effects
  traitStatMods: Array<{ stat: string; delta: number }>;
  traitAbilities: Array<{ traitName: string; name: string; desc?: string }>;
  traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }>;

  /** True when this HQ is the Black Crusade champion bearing all four Chaos god marks. */
  blackCrusadeChampion: boolean;

  /** Yngir (Necrons): this exact roster entry is the army's one flagged C'tan Shard upgrade —
   *  HQ slot + stat mods are applied elsewhere; this flag only drives the 2+ armor-save floor
   *  (Sv isn't a delta stat, can't go through optionStatMods) and the UI toggle's checked state. */
  ctanYngirActive: boolean;

  // Option effects (ki-parser-02) — stat/type/ability changes a selected wargear option confers.
  /** Stat deltas from selected options (e.g. Daemon Prince wings M +6), stacked over base. */
  optionStatMods: Array<{ stat: string; delta: number }>;
  /** Unit types ADDED by selected options (additive), e.g. "Jump pack infantry". */
  optionAddedUnitTypes: string[];
  /** Unit-type line REPLACED by a selected option (datasheet "change type to X"); null if none. */
  optionSetUnitType: string | null;
  /** Special rules granted by selected options (e.g. "Deep strike") — shown with "Option" badge. */
  optionAbilities: string[];

  /**
   * Tau Drones bought through a "Drone controller" option group, matched against
   * `FactionData.drones` by name and summed across every option group/choice that names a real
   * drone (a "Drone controller" group's choices are populated straight from the canonical Tau
   * Drones datasheet — see drone_choices.ts). Each entry carries its own stat-line/weapons/
   * abilities so UnitCard/PrintView can render it as an attached mini-model, not just a wargear
   * line item with a price tag.
   */
  attachedDrones: Array<{ drone: DroneType; count: number }>;
}

// ── Shared utility ────────────────────────────────────────────────────────────

export function findArmoryItem(data: FactionData, sel: ArmorySelection): ArmoryItem | undefined {
  const section = sel.section as keyof typeof data.armory_general;
  const sources = [
    data.armory_general,
    ...Object.values(data.armory_marks),
    ...Object.values(data.armory_legions),
    // Archetype-granted foreign armory (Traitor Guard → CSM, etc.) searched LAST, so a
    // same-named item in the unit's own codex always wins.
    ...(data.archetype_armory
      ? [data.archetype_armory.general, ...Object.values(data.archetype_armory.marks)]
      : []),
    // Supplements and allied detachments carry their OWN Armory (Legio Titanicus' Arc lance and
    // Mag-inverter shield are in neither the parent codex nor any legion tab). Searched after
    // everything above for the same reason: a same-named item in the primary faction wins.
    // Missing this meant an item bought on a supplement unit was charged and then granted
    // nothing at all — no weapon row, and none of its equipment abilities (user report
    // 2026-08-11: a Secutarii Axiarch paid 11+6 pts for an Arc lance and a Mag-inverter shield
    // and received neither the weapon nor Deflect/Parry).
    ...Object.values(data.allied ?? {}).flatMap(a => [
      a.armory_general,
      ...Object.values(a.armory_marks ?? {}),
      ...Object.values(a.armory_legions ?? {}),
    ]).filter((x): x is NonNullable<typeof x> => !!x),
    // Borrow-only armouries (Red Corsairs "Reaver Lord" reaching into the Space Marine codex).
    // Last of all: these are not this army's own gear, they are one item it was allowed to fetch.
    ...Object.values(data.borrowable_armories ?? {}),
  ];
  for (const armory of sources) {
    const found = (armory[section] as ArmoryItem[]).find(a => a.name === sel.itemName);
    if (found) return found;
  }
  // A saved list stores the item's NAME, so correcting a misspelling in the data orphans every
  // list holding it: the points stay on the selection and are still charged, while the lookup
  // fails and the item grants nothing. Same problem UNIT_RENAMES solves for units.
  const renamed = ARMORY_ITEM_RENAMES[sel.itemName];
  if (renamed) {
    for (const armory of sources) {
      const found = (armory[section] as ArmoryItem[]).find(a => a.name === renamed);
      if (found) return found;
    }
  }
  return undefined;
}

/** Armoury items whose stored name changed, old → new. See findArmoryItem. */
const ARMORY_ITEM_RENAMES: Record<string, string> = {
  // Relictors relic, misspelled here since the armoury was first imported; the sheet reads
  // "Grimoire Pandaemonica".
  'Grimoire Pandaeomonica': 'Grimoire Pandaemonica',
};

/**
 * The squad's built-in Champion/Sergeant/etc. — the second model entry when it's a single
 * fixed model (min===1, max===1) alongside a variable-size squad model. Used both to keep
 * the Champion's own weapon group separate and to decide whether weapon-trait Armory items
 * scope to just this model.
 */
function getBuiltInChampion(unit: Unit): Model | null {
  if (unit.models.length < 2) return null;
  // The usual shape is squad-then-champion, so models[1] stays the first thing checked and the
  // 94 units that already resolve through it are untouched.
  if (unit.models[1].min === 1 && unit.models[1].max === 1) return unit.models[1];
  // But a datasheet may list an optional add-on model before its champion: the Indomitus Crusader
  // Squad reads Neophyte 0-10, Initiate 4-9, Sword Brother 1-1, and the Space Marine Bike Squad and
  // Outrider Bikes do the same with their Sergeant. Looking only at models[1] found no champion at
  // all, so the Sword Brother — the ONLY model with Armory access on that datasheet — had no row of
  // its own and its purchases were drawn on the Initiates or the Neophytes (Discord, 2026-08-15).
  // Index 0 is deliberately excluded: a fixed model FIRST is a character with attendants (Company
  // Hero and its Animal Companion, Engineseer and Servitors), which is a different shape and is
  // grouped correctly already.
  const hasVariableSquad = unit.models.some(m => m.max > m.min);
  if (!hasVariableSquad) return null;
  for (let i = unit.models.length - 1; i >= 2; i--) {
    const m = unit.models[i];
    if (m.min === 1 && m.max === 1) return m;
  }
  return null;
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
 *   scope 'unit'      → match the keyword against the model's own mark / keywords.
 *   scope 'force'     → match against the host army's faction name (exact, case-insensitive).
 *   scope 'archetype' → match against the army's selected archetype name (exact, case-insensitive).
 *   scope 'roster'    → reserved (treated as force match for now).
 */
export function isOptionAvailable(
  cond: OptionCondition | undefined,
  mark: string | null,
  keywords: string[],
  hostFaction?: string | null,
  archetype?: string | null,
): boolean {
  if (!cond) return true;
  let has: boolean;
  if (cond.scope === 'unit') {
    has = unitHasKeyword(cond.keyword, mark, keywords);
  } else if (cond.scope === 'archetype') {
    has = (archetype ?? '').toLowerCase() === cond.keyword.toLowerCase();
  } else {
    has = (hostFaction ?? '').toLowerCase() === cond.keyword.toLowerCase();
  }
  return cond.type === 'instanceOf' ? has : !has;
}

/**
 * Split the item list of a loadout clause ("Bolt pistol; Frag grenades; Krak grenades") into names.
 *
 * The author separates them with ";", with "and", and on 13 datasheets with a plain comma — the
 * Outrider Bikes sheet writes "Onslaught gatling cannon, Twin bolt rifle", which read as a single
 * name matched no weapon at all, so the Invader-Quad's gear could never be attributed to it.
 * Checked first: no weapon anywhere in the game has a comma in its name, so this cannot split one.
 * Kept in one place because five call sites parse these clauses and drifted regexes here are silent
 * — a name that fails to match simply attributes nothing.
 */
export function splitLoadoutClause(text: string): string[] {
  return text.split(/;|,|\band\b/i).map(s => s.trim()).filter(Boolean);
}

/**
 * Split a clause AND resolve each item to the weapon it names.
 *
 * The author writes loadouts in the plural — "Frag grenades" — while the weapon row is singular,
 * so 160 clause items across the game matched no weapon at all and were swept up as unattributed
 * kit onto the squad's first row. That is why an Indomitus Sword Brother, whose entire printed
 * loadout is "Frag grenades; Krak grenades", got no row of its own.
 *
 * The singular is only tried when the exact name matches nothing; checked across every datasheet,
 * no plural form is itself a real weapon, so this cannot turn one weapon into another. An item that
 * still matches nothing (a multi-profile parent like "Twin bolt rifle", or kit such as "Bionics")
 * comes back untouched, exactly as before.
 */
export function resolveClauseItems(text: string, weapons: { name: string }[]): string[] {
  const byLower = new Map<string, string>();
  for (const w of weapons) byLower.set(w.name.toLowerCase(), w.name);
  return splitLoadoutClause(text).map(item => {
    const exact = byLower.get(item.toLowerCase());
    if (exact) return exact;
    return byLower.get(item.replace(/s$/i, '').toLowerCase()) ?? item;
  });
}

/**
 * Matches "<article> <model> is equipped with: …" for one model, capturing the item list.
 *
 * `loose` also accepts trailing words before "is equipped with" ("Every Outrider Marine and
 * Sergeant is equipped with:"). Only the shared-weapon rescue wants that: matching MORE clauses
 * there can only put a weapon back on the profile, whereas using it to decide what to HIDE would
 * let one model's clause silence another's gear.
 */
export function loadoutClauseFor(modelName: string, loose = false): RegExp {
  // Datasheets introduce a loadout with any of "Every / Each / A / An / The". \b matters: without
  // it the bare "A" alternative matches the last letter of a preceding word, so "Every Alpha Ranger
  // is equipped with" would satisfy a lookup for the model "Ranger".
  const esc = modelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `\\b(?:Every|Each|An|A|The) ${esc}${loose ? '[^.]*?' : ''} is equipped with:\\s*([^.]+)\\.`, 'i');
}

/**
 * Filter a weapon list down to what should be displayed: drop optional/choice
 * weapons that were not selected. A weapon counts as optional when it also appears
 * as a choice in some option group; built-in gear (not in any group) is always shown.
 */
export function computeWeaponsToShow(weapons: Weapon[], unit: Unit, item: RosterEntry, armoryGranted: string[] = []): Weapon[] {
  // A weapon bought from the Armory is on the model, full stop. When the datasheet ALSO lists it as
  // a squad swap (the Plague Marines' Plasma gun), it would otherwise stay hidden behind an option
  // the buyer never took — so a Champion could pay for a weapon that then appeared nowhere.
  const boughtFromArmory = new Set(armoryGranted);
  // Multi-profile weapons are stored as several entries named "<Weapon> - <Profile>"
  // (e.g. "Plasma blastgun - Rapid"). An option choice names the parent weapon ("Plasma
  // blastgun"), so match a choice against the weapon name BEFORE the " - " profile suffix.
  const baseName = (n: string) => n.split(' - ')[0];

  // Normalised key for linking an option choice to the weapon it grants. Beyond the " - profile"
  // strip above, drop a "(profile)" suffix, a leading count word/number ("two", "2", "a pair of")
  // and a trailing plural "s", then lowercase. Without this, multi-profile weapons named with
  // parentheses ("Plasma gun (Standard)") and count-phrased swap choices ("two Entropy cannons"
  // -> weapon "Entropy cannon") never match their choice, so the weapon is treated as a fixed
  // default and rendered in the live profile even when it was never bought (phantom weapon).
  const wkey = (n: string) => baseName(n)
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim()
    .toLowerCase()
    .replace(/^(?:a pair of|a|an|two|three|four|five|six|\d+)\s+/, '')
    .replace(/s$/, '');

  // Map each weapon (by normalised key) granted by an option choice to the choice name(s) that
  // unlock it. Compound choices ("Chainsword & Laspistol") are split so both weapons are
  // recognised as optional; the FULL choice name is also kept as a candidate so a weapon whose
  // own name contains "and" ("Shardnet and impaler", "Lash whip and Bonesword") still matches the
  // choice that grants it, instead of the split turning it into a phantom always-shown weapon.
  const optionalWeapons = new Map<string, Set<string>>();
  for (const g of unit.option_groups) {
    // A tick-box option has no choices at all — the weapon it buys is named only in its header
    // ("May take a Markerlight for +10 points."). With nothing to match, the weapon counted as a
    // fixed default and appeared on the datasheet for free. Tie it to the group's '__inline'
    // pseudo-choice, the same key the tick-box writes into optionQty.
    if (g.choices.length === 0 && g.inline_pts != null) {
      for (const w of unit.weapons) {
        const k = wkey(w.name);
        if (!new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}s?\\b`, 'i').test(g.header)) continue;
        if (unit.equipped_with?.includes(baseName(w.name))) continue;   // already a real default
        if (!optionalWeapons.has(k)) optionalWeapons.set(k, new Set());
        optionalWeapons.get(k)!.add('__inline');
      }
      continue;
    }
    for (const c of g.choices) {
      const parts = c.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
      for (const part of parts.length > 1 ? [c.name, ...parts] : [c.name]) {
        // A choice that just re-buys an ADDITIONAL copy of a weapon the unit is already
        // equipped with by default (e.g. Chaos Rhino's base "Combi-bolter" vs. its separate
        // "May be equipped with one of the following: Combi-flamer/Combi-bolter/Combi-melta"
        // second-mount option, same weapon name, no `replaces` link) must NOT hide the default
        // copy just because its name also happens to match a choice name. This check is scoped
        // to groups WITHOUT `replaces` — a replace-group's choices (e.g. Blightlord Terminators'
        // Bubonic axe/Power fist swapping out Balesword) must still be tracked as optional here
        // even though the group has a `replaces` link, since this map is what hides THEM (the
        // new weapon) until bought; `replaces` only handles removing the OLD weapon, separately.
        if (!g.replaces?.length && unit.equipped_with?.includes(part)) continue;
        // A choice can name the CREW as well as the gun ("Kustom mega-blasta with grot gunner",
        // "Twin-linked Big shoota with Grot Gunner") while the weapon row is just the gun. Try the
        // full name first, and only if nothing matches fall back to the name without that trailing
        // qualifier — otherwise the option never links to its weapon and the gun is treated as a
        // fixed default, shown on the datasheet whether or not it was ever bought.
        const full = wkey(part);
        const stripped = full.replace(/\s+with\s+.+$/, '');
        // Only fall back when the stripped name isn't itself part of the base loadout: a choice
        // reading "Big shoota with Grot Gunner" must not hide a Big shoota the model already
        // carries as standard.
        const candidates = stripped !== full && !unit.equipped_with?.toLowerCase().includes(stripped)
          ? [full, stripped] : [full];
        for (const pk of candidates) {
          if (!unit.weapons.some(w => wkey(w.name) === pk)) continue;
          if (!optionalWeapons.has(pk)) optionalWeapons.set(pk, new Set());
          optionalWeapons.get(pk)!.add(c.name);
          break;
        }
      }
    }
  }

  // Conditional grants written into equipped_with as "A <specialisation> is additionally equipped
  // with: <weapon>." — the weapon belongs ONLY to that named option choice, not the base loadout, so
  // it must stay hidden until that choice is picked (e.g. the Foetid Virion's Plague
  // sprayer, only when upgraded to Foul Blightspawn). Tie it to the choice like any optional weapon,
  // and remember it so the "always show if in equipped_with" rule below skips it.
  const conditionalGrantWeapons = new Set<string>();
  if (unit.equipped_with) {
    const allChoiceNames = new Set(unit.option_groups.flatMap(g => g.choices.map(c => c.name)));
    for (const m of unit.equipped_with.matchAll(/\bAn?\s+([^.]+?)\s+is additionally equipped with:\s*([^.]+)\./gi)) {
      const who = m[1].trim();
      if (!allChoiceNames.has(who)) continue;
      for (const wname of resolveClauseItems(m[2], unit.weapons)) {
        const bn = baseName(wname);
        if (!unit.weapons.some(w => baseName(w.name) === bn)) continue;
        conditionalGrantWeapons.add(bn);
        // optionalWeapons is read back with wkey(), so it must be WRITTEN with wkey() too —
        // keying by baseName here meant the lookup never matched and every "additionally equipped
        // with" weapon was treated as a fixed default, shown on the datasheet from the start.
        const ck = wkey(bn);
        if (!optionalWeapons.has(ck)) optionalWeapons.set(ck, new Set());
        optionalWeapons.get(ck)!.add(who);
      }
    }
  }

  // Weapons exclusive to a secondary model that hasn't been bought yet (e.g. Chaos
  // Ogryn's Power maul before any Ogryn is added) aren't part of the starting loadout.
  // Walks models[0] too: on four datasheets the OPTIONAL model is the first one (Indomitus
  // Crusader Squad's Neophyte, both bike squads' Attack Bike / Invader-Quad, Court of the Archon),
  // and skipping index 0 left an Attack Bike's Heavy bolter on a squad that had bought no Attack
  // Bike. The `m.min > 0` guard below is what actually protects a mandatory base squad, so
  // starting at 0 costs nothing.
  const zeroCountModelWeapons = new Set<string>();
  for (const m of unit.models) {
    if (m.min > 0) continue;
    // Only applies to multi-group units with per-group size tracking (e.g. Traitor Guard's
    // Chaos Ogryn). Units without modelSizes aren't using this "buy extra models" pattern
    // for display purposes, so leave their datasheet weapons untouched.
    if (!item.modelSizes) continue;
    const count = item.modelSizes[m.name] ?? m.min;
    if (count > 0) continue;
    // The Corsair Voidscarred specialists read "A Shade Runner is equipped with:", so matching only
    // "Every" left those clauses parsed by nothing and the specialists' weapons showed on a squad
    // that had taken none of them — hence the shared matcher.
    const equipText = unit.equipped_with.match(loadoutClauseFor(m.name))?.[1];
    if (!equipText) continue;
    for (const name of resolveClauseItems(equipText, unit.weapons)) {
      zeroCountModelWeapons.add(name);
    }
  }
  // A weapon the absent model SHARES with a model that IS present stays on the profile. The
  // Corsair Voidscarred specialists each carry a Plasma grenade, and so does every Voidscarred and
  // Felarch in the squad — hiding it because no Shade Runner was bought would strip a grenade from
  // ten models who have one.
  if (zeroCountModelWeapons.size > 0) {
    for (const m of unit.models) {
      const present = (item.modelSizes?.[m.name] ?? m.min) > 0;
      if (!present) continue;
      const match = unit.equipped_with.match(loadoutClauseFor(m.name, true));
      for (const name of resolveClauseItems(match?.[1] ?? '', unit.weapons)) {
        zeroCountModelWeapons.delete(name);
      }
    }
  }

  // Weapons that belong ONLY to a promoted variant model's own default loadout (e.g. Dire
  // Avenger Exarch's Diresword/Shuriken pistol, vs. the squad's base Avenger shuriken catapult)
  // are stored in the shared weapons[] array since the data model has a single `equipped_with`
  // string per unit (the base model only) — there's no separate slot for a variant's defaults.
  // Detect them: named in some OTHER group's `replaces` (so the engine clearly treats them as a
  // swappable "default" item) but absent from the base unit's own equipped_with text — such a
  // weapon can only be the variant's own default, so only show it once that variant is active.
  const variantOnlyWeapons = new Set<string>();
  if (unit.variant_models.length > 0) {
    // Compare against equipped_with using the weapon's BARE name — strip a multi-profile suffix,
    // either " - Standard" or " (Bolt ammo)" — because equipped_with names the weapon generically
    // (e.g. "Heavy bolt rifle") while weapons[]/replaces carry the ammo-profile variants
    // ("Heavy bolt rifle (Bolt ammo)"). Without this, a base weapon with ammo profiles is
    // mis-flagged as variant-only and hidden whenever the variant model isn't active (GH#69:
    // Heavy Intercessors' Heavy bolt rifle vanished as soon as a Heavy bolter was added).
    const bare = (n: string) => n.split(' - ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim();
    for (const g of unit.option_groups) {
      for (const name of g.replaces ?? []) {
        if (!unit.equipped_with?.includes(bare(name)) && unit.weapons.some(w => w.name === name)) {
          variantOnlyWeapons.add(name);
        }
      }
    }
  }
  const variantActive = !!getActiveVariant(item, unit);

  const hasReplaceGroup = unit.option_groups.some(g => g.replaces && g.replaces.length > 0);
  if (optionalWeapons.size === 0 && !hasReplaceGroup && zeroCountModelWeapons.size === 0 && variantOnlyWeapons.size === 0) return weapons;

  const selectedChoiceNames = new Set<string>();
  // Sum of qty taken across ALL groups that replace each weapon name — multiple independent
  // groups can each chip away at the same base weapon (e.g. Traitor Guard's "every model's
  // Lasgun may be replaced by Chainsword & Laspistol" AND its separate "per 10 models, one
  // Lasgun may become a Flamer/Melter/Plasma gun" both reduce the same Lasgun count). The
  // weapon is only fully removed once the combined qty reaches the full squad size; below
  // that it stays visible — computeWeaponGroups assigns the correct partial count to each
  // weapon (this function only decides presence, not the displayed "Nx" count).
  const replacedWeaponQty = new Map<string, number>();
  // Per-name override of the removal threshold, default item.size (squad model count). A
  // "one"-constraint swap (single choice, not "every"/"per_n") targeting a variant-exclusive
  // weapon only ever has ONE copy in the whole unit regardless of squad size (it belongs to the
  // single promoted model, e.g. the Exarch) — item.size is the wrong threshold there, it would
  // never fully remove the old weapon on squads larger than 1. The swap is fully resolved as
  // soon as its own qty (max 1) is taken.
  const replacedWeaponThreshold = new Map<string, number>();
  // A weapon with N copies/model is only safe to multiply the threshold by N when the
  // datasheet actually splits the swap into >=N independent per-copy groups (Talos' 2
  // Macro-scalpels, Carnifex Brood's 2 Monstrous scything talons: 2 separate "swap one of
  // their..." groups). Far more common is a single group that replaces ALL N copies in one
  // selection (e.g. Fellblade "may swap their 2 Laser destroyers" -> "2 Quad lascannons",
  // one choice) — there, item.size is already the correct threshold, and multiplying by N
  // would make it unreachable (ki-replaces-swap-manual-review-01 regression, found 2026-06-27).
  const replaceGroupCountByName = new Map<string, number>();
  for (const g of unit.option_groups) {
    for (const name of g.replaces ?? []) {
      replaceGroupCountByName.set(name, (replaceGroupCountByName.get(name) ?? 0) + 1);
    }
  }
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    const groupQty = Object.entries(ch)
      .filter(([ci]) => ci !== '__inline')
      .reduce((sum, [, qty]) => sum + (Number(qty) || 0), 0);
    if (g.replaces?.length && groupQty > 0) {
      for (const name of g.replaces) {
        replacedWeaponQty.set(name, (replacedWeaponQty.get(name) ?? 0) + groupQty);
        if (g.constraint.type === 'one' && (variantOnlyWeapons.has(name) || !!g.applies_to_model)) {
          replacedWeaponThreshold.set(name, 1);
        } else if (g.applies_to_model) {
          // A swap scoped to one model group is finished once THAT group's models have all taken
          // it — not once the whole squad has. Guardian Defenders field up to 2 Heavy weapon
          // platforms in a squad of 10; the default threshold of item.size meant both platforms
          // could swap their Scatter laser and the laser stayed on the profile anyway (GH#89).
          const owners = Array.isArray(g.applies_to_model) ? g.applies_to_model : [g.applies_to_model];
          const owned = owners.reduce((s, label) => {
            const m = unit.models.find(x => x.name === label);
            return s + (item.modelSizes?.[label] ?? m?.min ?? 0);
          }, 0);
          if (owned > 0) replacedWeaponThreshold.set(name, owned);
        } else if (!replacedWeaponThreshold.has(name)) {
          const copies = weaponCopiesPerModel(unit.equipped_with, name);
          // Either N independent per-copy groups (Talos/Carnifex), or a single group whose header
          // explicitly swaps just ONE of the N copies ("May replace one Dreadnought close combat
          // weapon" on a model equipped with 2) — both leave the other copies on the datasheet,
          // so the weapon must not vanish after the first swap.
          const singleCopySwap = /\b(one|the other|a)\b/i.test(g.header ?? '');
          // A single group worded "may swap EACH <weapon>" also swaps the copies one at a time —
          // UnitCard reads the same signal to offer N swaps per model (v1.59, GH#81), and the
          // hide-threshold has to agree with it. It did not: an Eldar War Walker carries two
          // Scatter lasers, swapping ONE reached the default threshold of item.size and both
          // vanished from the profile (GH#86). Kept separate from `singleCopySwap` because the
          // wordings mean different things — "each" is every copy individually, "one" is one of
          // them — but they need the same threshold.
          const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const perCopySwap = new RegExp(`\\beach\\s+${esc}`, 'i').test(g.header ?? '');
          if (copies > 1 && ((replaceGroupCountByName.get(name) ?? 0) >= copies || singleCopySwap || perCopySwap)) {
            replacedWeaponThreshold.set(name, item.size * copies);
          }
        }
      }
    }
    // A ticked tick-box counts as picking its group's pseudo-choice, so a weapon named only in
    // that group's header (see optionalWeapons above) appears exactly when the box is ticked.
    if (ch['__inline']) selectedChoiceNames.add('__inline');
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice) selectedChoiceNames.add(choice.name);
    }
  }
  // Weapons in a `replaces` list that ALSO appear in the selected choice name are net-kept
  // (e.g. "Power glaive & Shuriken pistol" replaces [Diresword, Shuriken pistol] but keeps
  // Shuriken pistol — it appears in both the replaces list and the chosen name). Don't mark
  // these as replaced.
  const keptByChoice = new Set<string>();
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g?.replaces?.length) continue;
    for (const [ci, qty] of Object.entries(ch)) {
      if (!qty || ci === '__inline') continue;
      const choice = g.choices[parseInt(ci)];
      if (!choice) continue;
      for (const part of choice.name.split(/\s*(?:&|\band\b)\s*/i).map(s => s.trim())) {
        if (g.replaces.includes(part)) keptByChoice.add(part);
      }
    }
  }
  const replacedWeaponNames = new Set<string>();
  for (const [name, qty] of replacedWeaponQty) {
    if (qty >= (replacedWeaponThreshold.get(name) ?? item.size) && !keptByChoice.has(name)) {
      replacedWeaponNames.add(name);
    }
  }
  return weapons.filter(w => {
    // Variant-only weapons: show iff variant active AND not replaced by a choice
    if (variantOnlyWeapons.has(w.name)) return variantActive && !replacedWeaponNames.has(w.name);
    if (replacedWeaponNames.has(w.name)) return false;
    if (zeroCountModelWeapons.has(w.name)) return false;
    if (boughtFromArmory.has(w.name)) return true;
    const owningChoices = optionalWeapons.get(wkey(w.name));
    if (!owningChoices) return true;
    // A weapon that's a default part of equipped_with must always show even if the same weapon
    // name also appears as a swap-upgrade choice (e.g. Ironclad's "Heavy flamer" comes with
    // the Seismic hammer but is also a choice for swapping the Storm bolter — the default copy
    // must not be hidden because the choice copy hasn't been selected).
    if (unit.equipped_with?.includes(baseName(w.name)) && !conditionalGrantWeapons.has(baseName(w.name))) return true;
    return [...owningChoices].some(cn => selectedChoiceNames.has(cn));
  });
}

// ── Generic base resolver ─────────────────────────────────────────────────────

function resolveBase(item: RosterEntry, unit: Unit, state: ArmyState, data: FactionData): ResolvedProfile {
  // Allied Detachment units use the allied faction's OWN Army Customisation (Core Rules: "Allies
  // may select their own Army Customisation options"), not the primary faction's archetype.
  const effectiveArchetype = effectiveArchetypeFor(item, state);
  const rule = getArchetypeRule(effectiveArchetype);

  // Points & slot
  const pts = computeUnitPoints(item, unit, effectiveArchetype);
  // Yngir: "One C'tan shard (any kind) counts as an HQ selection" (ods-verbatim) — re-slots
  // just the one flagged instance; uniqueness (only 1 per army) is enforced by a validator,
  // not here. C'tan Shard units otherwise live in Elites (see NECRON_SLOTS).
  const ctanYngirActive = !!item.ctanYngirUpgrade && effectiveArchetype === 'Yngir' && /^C'tan Shard/.test(unit.name);
  const effectiveSlot = ctanYngirActive ? 'HQ'
    : applyPlatoonSlotOverride(item, state.army, getEffectiveSlot(item.unitName, item.slot, rule));

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
  const hasMarkGroup = unit.option_groups.some(g => g.constraint.type === 'mark') || !!rule?.grantsMarkPurchase;
  // The four god marks count as a veteran ability. Mark of Chaos Undivided does NOT (rule omits the clause).
  // Locked-mark units (e.g. Plague Marines) use veteran_max:1 in their data instead.
  const markUsesVetSlot = hasMarkGroup && !unit.locked_mark && !!effectiveMark && effectiveMark !== 'Undivided';
  // AdMech "Veteran Maniple": "Any unit with the option to purchase a Doctrina Imperitive may
  // purchase a second one" — only for units with an explicit veteran_max (the Doctrina-eligible
  // roster), not units defaulting to the generic fallback of 2.
  const traitVetMaxBonus = unit.veteran_max != null
    ? state.traitPool.reduce((s, n) => s + (data.traits.find(t => t.name === n)?.veteran_max_bonus ?? 0), 0)
    : 0;
  const vetMax = Math.max(0, (unit.veteran_max ?? 2) - (markUsesVetSlot ? 1 : 0) + traitVetMaxBonus);
  const effectiveHasVetAbilities = unit.has_veteran_abilities
    || !!rule?.grantVetAbilitiesToAll
    || !!(rule?.grantVetAbilities?.includes(item.unitName));

  // Models to display — variant replaces the model group it's promoted from (derived from
  // the option group's own wording, since that group isn't always last in unit.models —
  // e.g. Traitor Guard's Traitor Sergeant promotes a Guardsman, but Ogryn is listed last).
  // Optional secondary models (e.g. Chaos Ogryn, min:0) only join the displayed Profile
  // once at least one has actually been bought via the squad-size controls.
  const visibleModels = unit.models.filter(m => {
    if (m.max === 0) return false;
    if (m.min > 0) return true;
    return (item.modelSizes?.[m.name] ?? m.min) > 0;
  });
  // When a promotion is active and the base model still has other members left (squad size
  // > 1), split its row into "Nx <base model>" + the promoted variant as its own row, instead
  // of replacing the whole row 1-for-1 — e.g. 10 Traitor Guardsmen → 9x Guardsman + 1x Sergeant.
  let modelsToShow: Model[];
  let modelCounts: (number | null)[];
  if (activeVariant) {
    const promoted = getPromotedModel(unit, activeVariant);
    const idx = visibleModels.indexOf(promoted);
    const rawCount = item.modelSizes?.[promoted.name] ?? item.size;
    // Minus however many were promoted, not always one: the Ork Burna Boyz and Lootas may upgrade
    // up to three models, and the base row kept reading "x4" while the points (correctly) charged
    // for two or three Spannas.
    const baseCount = Math.max(rawCount, promoted.min) - activeVariant.count;
    if (idx >= 0 && baseCount > 0) {
      modelsToShow = [
        ...visibleModels.slice(0, idx),
        promoted,
        activeVariant.variant,
        ...visibleModels.slice(idx + 1),
      ];
      modelCounts = modelsToShow.map(m => m === promoted ? baseCount : null);
    } else if (idx >= 0) {
      modelsToShow = visibleModels.map((m, i) => i === idx ? activeVariant!.variant : m);
      modelCounts = modelsToShow.map(() => null);
    } else {
      modelsToShow = [...visibleModels.slice(0, -1), activeVariant.variant];
      modelCounts = modelsToShow.map(() => null);
    }
  } else {
    modelsToShow = visibleModels;
    modelCounts = visibleModels.map(() => null);
  }
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
  // Core Rules "Mark of Tzeentch": "Character models AND Monstrous Creatures become a Psyker
  // knowing 1 power from any discipline" — the monster half was missing.
  const isTzeentchPsyker = (unit.is_character || unit.is_monster) && !unit.is_psyker && statModMark === 'Tzeentch';
  const effectivePsyker = unit.is_psyker || isTzeentchPsyker || isOptionalPsyker;

  // Weapons & loadout (unmodified — faction resolvers apply overrides)
  const equippedWith = unit.equipped_with ?? '';
  const weapons: Weapon[] = [...unit.weapons];

  // Weapon-targeting daemon weapon traits. A trait bought with a Character-only price
  // (p_char, no p_unit) on a squad with a built-in Champion/Sergeant or a promoted
  // variant (e.g. Traitor Sergeant) only modifies THAT model's personal copy of the named
  // weapon, not every copy the squad carries — those go to championWeaponTraitMap instead,
  // applied later to just that model's own weapon group.
  const builtInChampionForTraits = getBuiltInChampion(unit);
  const hasCharacterScopedBuyer = (!!builtInChampionForTraits && unit.models[0].max > 1) || !!activeVariant;
  // When ONLY the champion has Armory access (champion_has_armory, no unit-wide has_armory_access),
  // the buyer of any weapon-ability item is that champion — so a "…of the model gain X" item scopes
  // to the champion even if it also carries a p_unit price (e.g. Nurgle "Plague ammunition", both
  // p_unit and p_char set: without this it wrongly gave Poison(3+) to every Cultist's ranged weapon
  // instead of just the Aspiring Cultist Champion's — GH#73).
  const championOnlyArmory = !!unit.champion_has_armory && !unit.has_armory_access;
  const weaponTraitMap = new Map<string, string[]>();
  const championWeaponTraitMap = new Map<string, string[]>();
  for (const sel of item.armory) {
    if (sel.section !== 'daemon_weapons' || !sel.targetWeapon) continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isWeaponTrait(armItem.desc)) continue;
    const gains = extractWeaponGains(armItem.desc);
    if (gains.length === 0) continue;
    const isCharacterScoped = (armItem.p_char != null && armItem.p_unit == null) || championOnlyArmory;
    const target = (isCharacterScoped && hasCharacterScopedBuyer) ? championWeaponTraitMap : weaponTraitMap;
    target.set(sel.targetWeapon, [...(target.get(sel.targetWeapon) ?? []), ...gains]);
  }

  // NOTE: global trait weapon abilities are injected into weaponTraitMap after traitWeaponAbilities
  // is populated below (see "Inject global trait weapon abilities" comment).

  // Trait effects — resolved BEFORE the weapon-grant loop and equipMods below, because a trait
  // can hand the unit an Armory item (IG "Heavy Infantry" → Krak grenades + Plate armor) that
  // has to flow through those same two paths to actually reach the profile.
  // CSM army traits only apply to models with the "Chaos Space Marine" keyword.
  // Subfaction units (World Eaters, Death Guard, Thousand Sons, Emperor's Children) are excluded.
  // Allied Detachment units apply their OWN detachment's traits too — item.traits is already
  // populated from alliedTraitPool by applyArmyTraits, but the old `item.unitName in data.units`
  // gate silently discarded them for any ally of a DIFFERENT faction (name not in the primary
  // catalog), so allied trait stat mods/abilities never reached the profile. The CSM-keyword
  // restriction is evaluated against the item's OWN faction, not the primary's.
  const isAlliedScopeItem = !!(state.alliedFaction && item.factionSource === state.alliedFaction);
  const isMainFaction = !item.factionSource && item.unitName in data.units;
  const itemFactionForTraits = isAlliedScopeItem
    ? (FACTION_SLUG_TO_NAME[item.factionSource!] ?? '')
    : data.faction;
  const hasCSMKeyword = unit.keywords?.includes('Chaos Space Marine') ?? false;
  const traitsApply = (isMainFaction || isAlliedScopeItem) &&
    (itemFactionForTraits !== 'Chaos Space Marines' || hasCSMKeyword);
  const traitStatMods: Array<{ stat: string; delta: number }> = [];
  const traitAbilities: Array<{ traitName: string; name: string; desc?: string }> = [];
  const traitWeaponAbilities: Array<{ traitName: string; name: string; weapon_type?: string }> = [];
  const traitGrantedItems: string[] = [];
  // Dark Eldar traits are sub-faction-gated: a ᴷ/ᶜᵒ/ᶜᵘ trait only applies to a unit whose
  // effective sub-faction (its keyword, or the player's pick for shared multi-keyword units)
  // matches. Non-Dark-Eldar trait names carry no marker, so this never gates other factions.
  const deEffectiveSub = itemFactionForTraits === 'Dark Eldar'
    ? effectiveSubfactions(unit.keywords, item.subfaction)
    : null;
  if (traitsApply && item.traits.length > 0) {
    for (const t of item.traits) {
      if (deEffectiveSub) {
        const req = traitRequiredSubfaction(t.name);
        if (req && !deEffectiveSub.includes(req)) continue;
      }
      for (const e of getTraitEffects(t.name, unit)) {
        if (e.type === 'stat_mod')      traitStatMods.push({ stat: e.stat, delta: e.delta });
        else if (e.type === 'inv_save') traitAbilities.push({ traitName: t.name, name: `${e.value}+ Ward Save` });
        else if (e.type === 'unit_ability')   traitAbilities.push({ traitName: t.name, name: e.name, desc: e.desc });
        else if (e.type === 'weapon_ability') traitWeaponAbilities.push({ traitName: t.name, name: e.name, weapon_type: e.weapon_type });
        else if (e.type === 'grant_armory_item') traitGrantedItems.push(e.item);
      }
    }
  }

  // Items that GRANT a new weapon to the model — daemon weapons, vehicle upgrades, and plain
  // weapons bought from the Armory's "weapons" section (e.g. Boltgun on a Traitor Sergeant).
  // Patterns: "The model gains the 'X' weapon" (Kai), "The model gains a X" (Hunter-killer
  // missile), or a direct "weapons" section purchase (the item itself IS the weapon).
  const armoryGrantedWeapons: string[] = [];
  const pushGrantedWeapon = (granted: import('../types/data').ArmoryItem) => {
    // A weapon the datasheet ALREADY lists (e.g. Plague Marines' "Plasma gun", also sold in the
    // Nurgle armoury for the Champion) must not be pushed a second time: the duplicate row would
    // render twice — once with the datasheet's wording, once with the armoury's — and, being
    // flagged as armoury-granted, would also drag the squad's own copy out of the squad's weapon
    // group into the Champion's. Record the name so the Champion still keeps it, but reuse the
    // datasheet row. Checked per profile, since a multi-profile weapon lives in `weapons` as
    // "<name> - <profile>" rows and never under its bare name.
    const record = (name: string) => {
      armoryGrantedWeapons.push(name);
      return weapons.some(w => w.name === name);
    };
    if (granted.profiles && granted.profiles.length > 0) {
      for (const p of granted.profiles) {
        const name = `${granted.name} - ${p.name}`;
        if (record(name)) continue;
        weapons.push({
          name,
          range: p.range ?? '',
          type: p.type ?? '',
          s: p.s ?? '',
          ap: p.ap ?? '',
          d: p.d ?? '',
          abilities: p.abilities ?? '-',
        });
      }
    } else {
      if (record(granted.name)) return;
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
  };
  for (const sel of item.armory) {
    if (sel.section === 'weapons') {
      const armItem = findArmoryItem(data, sel);
      if (armItem) pushGrantedWeapon(armItem);
      continue;
    }
    if (sel.section !== 'daemon_weapons' && sel.section !== 'equipment') continue;
    const armItem = findArmoryItem(data, sel);
    if (!armItem?.desc || !isGrantWeapon(armItem.desc)) continue;
    const grantedName = extractGrantedWeaponName(armItem.desc);
    if (!grantedName) continue;
    // Find the weapon profile in armory_general.weapons — plus the archetype-granted foreign
    // armory, whose grant-items name weapons that only exist over there (CSM "Kai" → Kai gun).
    const weaponPool = [
      ...(data.armory_general.weapons as import('../types/data').ArmoryItem[]),
      ...((data.archetype_armory?.general.weapons ?? []) as import('../types/data').ArmoryItem[]),
    ];
    // Match apostrophe-insensitively: the source spreadsheets mix the typographic apostrophe (’)
    // in weapon NAMES with the plain one (') in the prose that grants them, so an exact compare
    // silently dropped grants like Votann's "Ancestor’s judgement warhead".
    const sameName = (a: string, b: string) =>
      a.toLowerCase().replace(/[’‘`´]/g, "'") === b.toLowerCase().replace(/[’‘`´]/g, "'");
    const granted = weaponPool.find(w => sameName(w.name, grantedName));
    if (granted) pushGrantedWeapon(granted);
  }

  // Armory items handed over by an army Trait (IG "Heavy Infantry" → Krak grenades + Plate
  // armor). Weapons join the profile; equipment is collected here and fed to parseEquipMods
  // below alongside the bought items, so its desc text ("4+ armor save") moves the stat.
  type EquipInput = { name: string; desc: string; armourKeyword?: string };
  const traitGrantedEquip: EquipInput[] = [];
  for (const itemName of traitGrantedItems) {
    const lc = itemName.toLowerCase();
    const asWeapon = (data.armory_general.weapons as import('../types/data').ArmoryItem[])
      .find(w => w.name.toLowerCase() === lc);
    if (asWeapon) { pushGrantedWeapon(asWeapon); continue; }
    const asEquip = (data.armory_general.equipment as import('../types/data').ArmoryItem[])
      .find(e => e.name.toLowerCase() === lc);
    if (asEquip) traitGrantedEquip.push({ name: asEquip.name, desc: asEquip.desc ?? '', armourKeyword: asEquip.armourKeyword });
  }

  // Equipment a model carries as part of its DEFAULT loadout, named in `equipped_with` rather
  // than bought. The datasheets say "Every model is equipped with: Bionics; Galvanic rifle." and
  // expect the reader to look Bionics up in the Armory; until now the engine only resolved
  // WEAPONS out of that sentence, so a Sororitas Crusader's Storm shield, a Space Marine Assault
  // Squad's Jump pack and every AdMech unit's Bionics were printed in the loadout line and then
  // granted nothing at all. Feeding them through the same parseEquipMods path as bought items
  // means the rule text shows up AND its stat/ward effect actually applies.
  //
  // Three deliberate exclusions, each measured across all 19 factions before being written:
  //   - items with an `armourKeyword` — armour is already modelled via the unit's own keyword,
  //     and re-applying it here would double-count the profile bonuses baked into the statline
  //     (Gravis armor on the Aggressor/Inceptor/Eradicator/Heavy Intercessor squads);
  //   - names that are also a weapon on this datasheet — several armouries list a weapon in the
  //     equipment section too, and the profile row already covers it (IG Heavy stubber on five
  //     vehicles, Dark Eldar Bladevanes, Tyranid Acid Maw, the Judicar's Relic blade);
  //   - one- and two-character names, because "-" is a real entry in some equipment tables and
  //     `equipped_with: "... is equipped with: -."` would match it.
  // Anything whose effect the datasheet ALREADY spells out in its abilities is deduped inside
  // parseEquipMods against `baseAbilities`, so this cannot print a rule twice.
  const defaultEquip: EquipInput[] = [];
  {
    const ew = unit.equipped_with ?? '';
    const datasheetWeapons = new Set(unit.weapons.map(w => w.name.split(' - ')[0].toLowerCase()));
    const seen = new Set<string>();
    const pools = [
      data.armory_general,
      ...Object.values(data.armory_marks),
      ...Object.values(data.armory_legions),
      ...(data.archetype_armory ? [data.archetype_armory.general, ...Object.values(data.archetype_armory.marks)] : []),
      ...Object.values(data.allied ?? {}).map(a => a.armory_general).filter((x): x is NonNullable<typeof x> => !!x),
    ];
    for (const pool of pools) {
      for (const e of (pool.equipment ?? []) as import('../types/data').ArmoryItem[]) {
        if (!e.desc || e.name.length < 3 || e.armourKeyword) continue;
        const lc = e.name.toLowerCase();
        if (seen.has(lc) || datasheetWeapons.has(lc)) continue;
        // Delimited match: the loadout is a "; "/", "-separated list, so require the name to sit
        // on its own rather than inside a longer one ("Bionics" must not fire on "Enhanced Bionics").
        const esc = e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`(?:^|[:;,]\\s*|\\s)${esc}\\s*(?:[;,.]|$)`, 'i').test(ew)) continue;
        seen.add(lc);
        defaultEquip.push({ name: e.name, desc: e.desc });
      }
    }
  }

  // Equipment mods
  // `traitGrantedEquip` (IG "Heavy Infantry" → Plate armor) is parsed SEPARATELY from purchased
  // Armory items into `traitEquipMods` below — a Trait's own text grants to the WHOLE unit, not
  // just the Champion/promoted-variant row that a real per-model Armory purchase is scoped to
  // (see equipModsScopedToChampion in UnitCard.tsx). Mixing them into one EquipMods object meant
  // Heavy Infantry's save bonus only ever showed up on the unit's Sergeant row, same as if the
  // Sergeant alone had bought Plate armor (ki-ig-heavy-infantry-trait-champion-only-01).
  const equipItems = item.armory
    .filter(a => {
      const ai = findArmoryItem(data, a);
      if (a.section === 'daemon_weapons') return !isWeaponTrait(ai?.desc) && !isGrantWeapon(ai?.desc);
      if (a.section === 'equipment') return !isGrantWeapon(ai?.desc); // exclude weapon-granting upgrades
      return false;
    })
    .map((a): EquipInput => {
      const found = findArmoryItem(data, a);
      return { name: a.itemName, desc: found?.desc ?? '', armourKeyword: found?.armourKeyword };
    });
  const equipMods: EquipMods = parseEquipMods(equipItems, unit.armourKeyword, unit.abilities);
  const traitEquipMods: EquipMods = parseEquipMods(traitGrantedEquip, unit.armourKeyword, unit.abilities);
  if (traitEquipMods.invulnSave !== null && (equipMods.invulnSave === null || traitEquipMods.invulnSave < equipMods.invulnSave)) {
    equipMods.invulnSave = traitEquipMods.invulnSave;
  }
  equipMods.grantedAbilities.push(...traitEquipMods.grantedAbilities);

  // Default gear is parsed SEPARATELY and contributes only its rule text and its ward save.
  // A datasheet's printed statline is authored with the default loadout already on the model —
  // a Space Marine Assault Squad prints 12" precisely BECAUSE every model carries a Jump pack —
  // so applying the item's "+6\" movement" on top would move them to 18". Ward saves are the
  // exception worth carrying: they appear in no stat column, which is why an Adeptus Mechanicus
  // unit's Bionics has to come from here now that the sheet no longer prints it as an ability.
  if (defaultEquip.length > 0) {
    const dm = parseEquipMods(defaultEquip, unit.armourKeyword, unit.abilities);
    if (dm.invulnSave !== null && (equipMods.invulnSave === null || dm.invulnSave < equipMods.invulnSave)) {
      equipMods.invulnSave = dm.invulnSave;
    }
    equipMods.grantedAbilities.push(...dm.grantedAbilities);
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
          (wa.weapon_type === 'bolt'    && /bolt/i.test(weapon.name));
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
    // A Character-only-priced item (p_char, no p_unit) on a squad with a Champion/promoted
    // Sergeant only affects THAT model's own weapons, not the whole squad's — same scoping
    // as the targeted daemon-weapon traits above.
    const isCharacterScoped = (armItem.p_char != null && armItem.p_unit == null) || championOnlyArmory;
    const target = (isCharacterScoped && hasCharacterScopedBuyer) ? championWeaponTraitMap : weaponTraitMap;
    for (const weapon of weapons) {
      const isMelee = weapon.range === '-' || /^melee/i.test(weapon.type ?? '');
      const applies =
        !wtype ||
        (wtype === 'melee'  &&  isMelee) ||
        (wtype === 'ranged' && !isMelee) ||
        (wtype === 'bolt'   && /bolt/i.test(weapon.name + ' ' + (weapon.type ?? '')));
      if (applies) {
        target.set(weapon.name, [...(target.get(weapon.name) ?? []), ability]);
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
  // Yngir's C'tan Shard upgrade (ods-verbatim): HQ slot is applied via effectiveSlot above; the
  // 2+ armor save floor in UnitCard.tsx (same "best of" pattern as equipMods.armorSave); the +6"
  // power range in PsychicModal.tsx's bumpRange; "knows Time's Arrow" needs no extra wiring —
  // every C'tan Shard already has it in the shared psychic/disciplines.json "Powers" list. Only
  // the +1 S/T/I/A stat mod is wired here, alongside the rest of the option-effect pipeline.
  if (ctanYngirActive) {
    optionStatMods.push({ stat: 'S', delta: 1 }, { stat: 'T', delta: 1 }, { stat: 'I', delta: 1 }, { stat: 'A', delta: 1 });
  }
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
  // A choice's own effect.grants_weapons (e.g. Tyranid Biomorphs "Implant Attack"/"Symbiote
  // Rippers", which grant a weapon out of the faction's general Armory rather than a stat/
  // ability) — applyEffect() above only forwards stat_mod/adds_unit_types/set_unit_type/
  // grants_abilities, the same way the item.armory loop below needs its own separate
  // grants_weapons pass alongside applyEffect(ai.effect).
  const grantChoiceWeapons = (eff: OptionEffect | undefined) => {
    for (const grantedName of eff?.grants_weapons ?? []) {
      const granted = (data.armory_general.weapons as import('../types/data').ArmoryItem[])
        .find(w => w.name.toLowerCase() === grantedName.toLowerCase());
      if (granted) pushGrantedWeapon(granted);
    }
  };
  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g) continue;
    const hasAnySelection = Object.entries(ch).some(([ci, qty]) => (ci === '__inline' || !!qty) && !!qty);
    // Group-level effect applies whenever the group has a selection (covers inline toggles).
    if (hasAnySelection) { applyEffect(g.effect); grantChoiceWeapons(g.effect); }
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline' || !qty) continue;
      const choice = g.choices[parseInt(ci)];
      if (choice?.abilities?.length) {
        for (const ab of choice.abilities) {
          if (!choiceAbilities.includes(ab)) choiceAbilities.push(ab);
        }
      }
      applyEffect(choice?.effect);
      grantChoiceWeapons(choice?.effect);
    }
  }
  // Armory-item effects: a bought item may confer a UNIT-TYPE change ("Chaos Space Marine bike" →
  // "Bike"; "Daemonic stature" → "Monstrous Infantry"). Stats and quoted abilities for these items
  // still come from equipMods; this only adds the type, de-duplicated against what the model has.
  for (const sel of item.armory) {
    const ai = findArmoryItem(data, sel);
    if (ai?.effect) applyEffect(ai.effect);
    for (const grantedName of ai?.effect?.grants_weapons ?? []) {
      const granted = (data.armory_general.weapons as import('../types/data').ArmoryItem[])
        .find(w => w.name.toLowerCase() === grantedName.toLowerCase());
      if (granted) pushGrantedWeapon(granted);
    }
  }

  // Dark Eldar Combat Drugs (army rule, free): a unit-wide stat bump (Adrenalight/Grave lotus/
  // Painbringer) or a rules ability (Hypex/Serpentin/Splintermind). Selected via the per-unit
  // picker; capped by base 1 + one per Stimulant supply, enforced in the UI.
  if (item.combatDrugs?.length) {
    for (const dn of item.combatDrugs) {
      const drug = getCombatDrug(dn);
      if (!drug) continue;
      for (const sm of drug.statMods) optionStatMods.push(sm);
      if (drug.ability) optionAbilities.push(`${drug.name} (Combat drug): ${drug.desc}`);
    }
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
  // Archetype-forced mandatory ability (Brood Brothers' Ambush, Gue'vesa's Supporting Fire) —
  // no opt-out, so it's always shown, never a toggle. `rule` is already scoped to THIS item's own
  // detachment (effectiveArchetypeFor above), so an Allied Detachment whose OWN archetype forces
  // an ability shows it too — the old `!item.factionSource` gate wrongly suppressed it for allies
  // (and was redundant for supplement units, whose scoped rule is undefined anyway).
  if (rule?.forcedAbility && !(rule.forcedAbility.creatureOnly && unit.is_vehicle)) {
    ruleNotes.push(rule.forcedAbility.name);
  }
  // Archetype-granted "Command squad" (e.g. Sorcerer Circle → Chaos Sorcerers, Librarian
  // Conclave → Librarians): surface the granted ability on the profile so the player can SEE it —
  // the join mechanics read the same grant (UnitCard dropdown + validator). Scoped via `rule`.
  if (rule?.grantsCommandSquad?.includes(item.unitName)) {
    ruleNotes.push('Command squad');
  }

  return {
    pts, effectiveSlot,
    effectiveMark, markIsForced, markIsLocked, statModMark, markUsesVetSlot, vetMax,
    variant, variantActive, modelsToShow, modelCounts, squadLeaderIdx,
    isTzeentchPsyker, isOptionalPsyker, psykerGroupIdx, effectivePsyker,
    isFavored: false,
    effectiveHasVetAbilities,
    equippedWith, weapons, weaponsToShow: weapons, weaponGroups: [], attachedDrones: [], armoryGrantedWeapons, weaponTraitMap, championWeaponTraitMap,
    injectedAbilities: choiceAbilities,
    injectedRuleNotes: ruleNotes,
    equipMods,
    traitEquipMods,
    traitStatMods, traitAbilities, traitWeaponAbilities,
    blackCrusadeChampion,
    ctanYngirActive,
    optionStatMods, optionAddedUnitTypes, optionSetUnitType, optionAbilities,
  };
}

/** The abilities string a weapon would render with, after merging in a trait map's extra
 * abilities for it — used to compare whether two model-groups' copies of a weapon are
 * actually identical or have diverged (e.g. a Character-only daemon weapon trait). */
function renderedAbilities(w: Weapon, traitMap: Map<string, string[]>): string {
  const extra = traitMap.get(w.name) ?? [];
  if (extra.length === 0) return (w.abilities && w.abilities !== '-') ? w.abilities : '-';
  const base = (w.abilities && w.abilities !== '-') ? w.abilities : '';
  return mergeWeaponAbilities(base, extra).merged;
}

/**
 * Split weaponsToShow into per-model-group tables.
 *   - Units whose `equipped_with` has more than one "Every X is equipped with: ..." clause
 *     (e.g. Traitor Guard: Traitor Guardsman vs Chaos Ogryn) get one group per clause, each
 *     tagged with the model count for an "[N]x" prefix. Weapons not claimed by any clause
 *     (e.g. selected special/heavy-weapon options) join the first group.
 *   - Units with a single equipped_with clause but a built-in Champion/Sergeant (squad model
 *     + a min:1/max:1 model) get one group per model, each with an "[N]x" prefix (squad count
 *     / 1). If the Champion's copy of every weapon renders identically to the squad's (the
 *     vast majority — no Character-only weapon trait bought), the two groups collapse back
 *     into a single one with the combined count. The Champion's Armory-bought weapons (if
 *     any) join their own group's table.
 *   - Everything else (units with no built-in Champion) returns a single unlabeled,
 *     uncounted group — unchanged from the previous flat weaponsToShow rendering.
 */
export function computeWeaponGroups(unit: Unit, item: RosterEntry, profile: ResolvedProfile): WeaponGroup[] {
  const baseName = (n: string) => n.split(' - ')[0];

  const builtInChampion = getBuiltInChampion(unit);
  const armoryGatedByVariant = unit.option_groups.some(g => g.variant_link && /armory/i.test(g.header));
  const championArmoryInOwnBlock = !!builtInChampion && unit.champion_has_armory && !armoryGatedByVariant;

  // A promoted variant (e.g. Traitor Sergeant) with its own variant_link-gated Armory access
  // gets its Armory-bought weapons (e.g. Boltgun) extracted into its own group too, same as a
  // built-in Champion. `profile.modelsToShow` places the promoted base model immediately
  // before the variant when both are shown (see resolveBase) — but only when the base group had
  // more than one model to split off (e.g. 9 Traitor Guardsmen keep their own row next to the
  // promoted Sergeant). When the base group had exactly one model, resolveUnitProfile REPLACES
  // its row with the variant instead of splitting it, so "the entry right before the variant" is
  // whatever OTHER model group happens to sit there — for the Sororitas Sisters Novitiate
  // (9 Sister Novitiate + 1 Sister Superior, promotable to Veteran Superior), that wrongly
  // resolved to "Sister Novitiate", and the block below folded the Veteran Superior's weapon
  // count into the Novitiates' row instead of the Superior's (10x Auto pistol for a 9-model
  // squad). `getPromotedModel` derives the true base from the option group's own header text —
  // the same helper points.ts already uses for pricing — so it can't be fooled by position.
  const variantIdx = profile.variantActive ? profile.modelsToShow.findIndex(m => m === profile.variant) : -1;
  const variantArmoryActive = variantIdx > 0 && armoryGatedByVariant;
  const activeVariantForPromotion = variantArmoryActive ? getActiveVariant(item, unit) : null;
  const promotedModelName = activeVariantForPromotion ? getPromotedModel(unit, activeVariantForPromotion).name : null;

  const grantedSet = new Set(profile.armoryGrantedWeapons);
  // Only weapons the Armory purchase actually ADDED belong exclusively to the Champion. When the
  // bought weapon is also on the unit's own datasheet (Plague Marines' Plasma gun is both a squad
  // swap option and a Nurgle armoury item), the row is shared: moving it into the Champion's block
  // would delete the squad's purchased copies from their own weapon table.
  const datasheetNames = new Set(unit.weapons.map(w => w.name));
  const addedByArmory = (name: string) => grantedSet.has(name) && !datasheetNames.has(name);
  const extractGranted = championArmoryInOwnBlock || variantArmoryActive;
  const championExtraWeapons = extractGranted
    ? profile.weaponsToShow.filter(w => addedByArmory(w.name))
    : [];
  const remaining = extractGranted
    ? profile.weaponsToShow.filter(w => !addedByArmory(w.name))
    : profile.weaponsToShow;

  // Weapons the SQUAD bought through its own option groups ("two Plague Marines may swap their
  // Bolters") — never the Champion's. Computed before the groups are built because it decides both
  // what the Champion's row may show and, mirrored just below, what the squad's row may show.
  const squadOnlyGrantedNames = new Set<string>();
  if (builtInChampion) {
    for (const [gi, g] of unit.option_groups.entries()) {
      if (!g.replaces?.length || g.applies_to_model) continue;
      for (const [ci, qty] of Object.entries(item.optionQty[gi] ?? {})) {
        if (ci === '__inline' || !qty) continue;
        const choice = g.choices[parseInt(ci)];
        if (!choice) continue;
        const parts = choice.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
        for (const part of (parts.length > 1 ? parts : [choice.name])) squadOnlyGrantedNames.add(part);
      }
    }
  }

  // The mirror image: a weapon the Champion bought from the Armory that the squad did NOT buy.
  // These are shared rows — the weapon is on the datasheet too (the Plague Marines' Plasma gun is
  // both a squad swap and a Nurgle armoury item), so they are not in `championExtraWeapons` and,
  // left alone, the Champion's purchase silently vanished into the squad's line and the Champion
  // got no row of its own at all.
  const championBought = builtInChampion
    ? remaining.filter(w => grantedSet.has(w.name) && datasheetNames.has(w.name))
    : [];
  // Of those, the ones the squad never bought for itself belong to the Champion alone and must be
  // kept off the squad's row.
  const championOnlyWeapons = championBought.filter(w => !squadOnlyGrantedNames.has(baseName(w.name)));
  const squadWeapons = remaining.filter(w => !championOnlyWeapons.includes(w));

  // "Every Terminator is equipped with: …" AND "The Terminator Sergeant is equipped with: …" —
  // the article varies on the author's sheets, and matching only "Every" meant a squad whose
  // second clause opened with "The" was read as ONE loadout: the Terminator Squad showed 5x Power
  // fist AND 5x Power sword on five models instead of 4x and 1x (GitHub #77). Checked across all
  // 667 equipped_with strings in the game: this splits 5 units that were previously merged
  // (Terminator Squad, Rubric Marines, Dark Commune, Incubi, Dynasty Phaeron) and every clause
  // label in them resolves to a real model group, so no unit gains an orphan row.
  // Single-model vehicles/monsters routinely word this "A Ghostkeel Shas'vre IS A SINGLE MODEL
  // AND equipped with: …" (or "a single character model and", "a single model", "a character
  // model and", ...) instead of the plain "is equipped with:" — 69 datasheets use some form of
  // this aside. Tolerating it doesn't change anything for a unit with only ONE model row (the
  // fallback below already uses item.size correctly for those), but it lets a unit that ALSO
  // prints a real second clause for an attached companion (Y'vahra/R'varna Battlesuit: "Every
  // Missile Drone is equipped with: Missile pod.") actually reach 2 matched clauses instead of 1,
  // which is what routes it into the per-clause split below instead of the flattened fallback.
  const clauses = [...unit.equipped_with.matchAll(
    /(?:Every|The|An?) ([^.]+?) is (?:a single character model and |a single model and |a single model |a single character and |a character model and |a character and |)equipped with:\s*([^.]+)\./g
  )];
  // Ghostkeel Battlesuits has no second clause at all (its 2 Stealth Drones carry no weapons of
  // their own) — it never reaches the >1 threshold above even with the tolerant regex. Its one
  // clause DOES name a real model row ("Ghostkeel Shas'vre") distinct from the unit's other row
  // ("Stealth Drone"), unlike the generic "Every model is equipped with: …" wording plenty of
  // ordinary multi-row squads use (Rough Riders: Rough Rider + Sergeant rows, deliberately meant
  // to cover BOTH). Routing every lone-but-model-named clause through the per-clause split — not
  // just ones that clear >1 — fixes exactly this shape without touching "Every model" units: the
  // literal word "model"/"models" is never itself a model row's name, so those still fall through
  // to the flattened fallback unchanged. Previously the flattened fallback multiplied the suit's
  // own weapons (2 Flamers) by the WHOLE unit's model count including its 2 non-weapon-bearing
  // Stealth Drones (1 + 2 = 3), showing "6x Flamer" instead of "2x" (Discord, Rigzar).
  const namedSingleClauseAmongMultipleRows = clauses.length === 1 && unit.models.length > 1 &&
    unit.models.some(m => m.name.toLowerCase() === clauses[0][1].trim().toLowerCase());

  let groups: WeaponGroup[];
  if (clauses.length > 1 || namedSingleClauseAmongMultipleRows) {
    groups = [];
    const used = new Set<string>();
    let variantGroup: WeaponGroup | null = null;
    let variantSplitFromFirstClause = false;
    for (const [ci, c] of clauses.entries()) {
      const label = c[1].trim();
      const names = resolveClauseItems(c[2], unit.weapons).map(baseName);
      // Also matched against the PARENTHESISED spelling: production writes multi-profile rows as
      // "Demiklaives (dual blades)" while the clause names the parent ("Demiklaives"), so on a
      // multi-clause datasheet the group came out empty and was dropped — the Dark Eldar Klaivex's
      // only weapon never appeared at all.
      const bareWeaponName = (n: string) => baseName(n).replace(/\s*\([^)]*\)\s*$/, '').trim();
      const gWeapons = remaining.filter(w =>
        names.includes(baseName(w.name)) || names.includes(bareWeaponName(w.name)));
      gWeapons.forEach(w => used.add(w.name));
      const modelCountOf = (i: number) => {
        const mm = profile.modelsToShow[i];
        return profile.modelCounts[i] ?? (item.modelSizes?.[mm.name] ?? (mm.min > 0 ? mm.min : mm.max));
      };
      // Matched case-insensitively: the author's own sheets write "Every Sniper drone is equipped
      // with:" beside a model row named "Sniper Drone", and likewise for the Tech-Priest and the
      // Daemon Prince. A case-sensitive lookup attached those clauses to nothing. Checked first:
      // no datasheet has two model rows whose names differ only by case, so this cannot mis-match.
      const eq = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
      // A clause can also be addressed to a PROMOTED model rather than a model row — "The Klaivex
      // is equipped with: Demiklaives", "Every Spanna is equipped with: Choppa; Slugga". There is
      // exactly one of it, and only while the promotion is taken: the Lootas showed a Spanna row
      // holding a Choppa with no Spanna in the squad, then showed it as "x0" once there was one.
      const isVariantLabel = (unit.variant_models ?? []).some(v => eq(v.name, label));
      const variantTaken = isVariantLabel && profile.variantActive && eq(profile.variant?.name ?? '', label);
      // How many were promoted — 1 everywhere except the two Ork squads that read "Up to three …
      // may be upgraded to Spannas" (author, 2026-08-16: "up to three per unit").
      const variantCount = variantTaken ? (getActiveVariant(item, unit)?.count ?? 1) : 0;
      const idx = profile.modelsToShow.findIndex(m => eq(m.name, label));
      const m = idx >= 0 ? profile.modelsToShow[idx] : null;
      // A clause can cover TWO model rows at once — "Every Jakhal and Jakhal Pack Leader is
      // equipped with:", plus Voidscarred and Kroot Farstalkers. The label then matches no single
      // row, the group's count stayed null, and the swap arithmetic below worked off one model:
      // swapping a single Shuriken rifle emptied the whole squad's (GitHub #90, same shape).
      // Only counts parts that are real model rows, so a label naming something else is untouched.
      const parts = label.split(/\s*\band\b\s*/i).map(s => s.trim()).filter(Boolean);
      const partIdxs = parts.length > 1
        ? parts.map(p => profile.modelsToShow.findIndex(mm => eq(mm.name, p))).filter(i => i >= 0)
        : [];
      // A promotion is a single model, and `modelsToShow` carries it with no count of its own
      // (its min/max are 0), so asking the model list gave "x0" for a Spanna that is present.
      const count = variantTaken ? variantCount
        : m
        ? modelCountOf(idx)
        : (isVariantLabel ? 1
            : (partIdxs.length === parts.length && partIdxs.length > 1
                ? partIdxs.reduce((sum, i) => sum + modelCountOf(i), 0)
                : null));
      // A clause for an OPTIONAL model the player took none of gets no row. Its weapons are still
      // marked used above, so they are not treated as unattributed kit and dumped onto the first
      // row: an Armory purchase on an Indomitus Crusader Squad landed on a Neophyte line that only
      // existed because the clause did, even with zero Neophytes in the squad.
      // Looked up in unit.models, not modelsToShow — the latter has already dropped absent models,
      // so it can never tell us that this clause's model is one of them.
      const clauseModel = unit.models.find(x => eq(x.name, label));
      const optionalAndAbsent = !!item.modelSizes && !!clauseModel && clauseModel.min === 0 &&
        (item.modelSizes[clauseModel.name] ?? clauseModel.min) === 0;
      if (isVariantLabel && !variantTaken) continue;      // promotion not taken: no such model
      // The whole row was promoted away — a 1-model Tauros squadron upgraded to a Venator leaves no
      // plain Tauros. Its clause row is dropped ONLY when the promoted model has a loadout line of
      // its own: the Tauros Venator does ("A Tauros Venator is equipped with: Twin-linked heavy
      // stubber"), so the grenade launcher goes with the Tauros. A Sororitas Veteran Superior has
      // no line of her own and keeps the Sister Superior's Boltgun, so that row must stay.
      const promotedAway = !!clauseModel && !m &&
        !profile.modelsToShow.some(x => eq(x.name, label)) &&
        profile.variantActive && !!profile.variant &&
        clauses.some(c => eq(c[1].trim(), profile.variant!.name));
      if (promotedAway) continue;
      if (!optionalAndAbsent) {
        const spans = partIdxs.length === parts.length && partIdxs.length > 1
          ? partIdxs.map(i => profile.modelsToShow[i].name) : undefined;
        groups.push({ label, count, weapons: gWeapons, traitMap: profile.weaponTraitMap,
          ...(spans ? { models: spans } : {}) });
      }

      // The promoted variant (e.g. Traitor Sergeant) shares this clause's base loadout. If
      // Character-only Armory purchases (Boltgun, "all ranged weapons gain X", etc.) make its
      // copy render differently, give it its own table; otherwise fold its one model into
      // this clause's count (fixes the count also being off-by-one in the common case).
      if (variantArmoryActive && label === promotedModelName) {
        const champTraitMap = new Map(profile.weaponTraitMap);
        for (const [k, v] of profile.championWeaponTraitMap) {
          champTraitMap.set(k, [...(champTraitMap.get(k) ?? []), ...v]);
        }
        const identical = championExtraWeapons.length === 0 &&
          gWeapons.every(w => renderedAbilities(w, profile.weaponTraitMap) === renderedAbilities(w, champTraitMap));
        if (identical) {
          groups[groups.length - 1].count = (count ?? 0) + 1;
        } else {
          variantGroup = {
            label: profile.variant!.name,
            count: 1,
            weapons: [...gWeapons, ...championExtraWeapons],
            traitMap: champTraitMap,
          };
          variantSplitFromFirstClause = ci === 0;
          groups.push(variantGroup);
        }
      }
    }
    // A weapon named in no loadout clause is normally squad-wide kit and belongs on the first
    // group. But one that can ONLY arrive through an option group scoped with `applies_to_model`
    // belongs to THAT model's group: swapping a Guardian Defenders platform's Scatter laser for an
    // Aeldari missile launcher printed the launcher on the Guardian Defender row, so a ten-model
    // squad read as ten missile launchers (GH#89).
    const ownerOfWeapon = new Map<string, string>();
    for (const g of unit.option_groups) {
      if (!g.applies_to_model) continue;
      const owner = Array.isArray(g.applies_to_model) ? g.applies_to_model[0] : g.applies_to_model;
      for (const c of g.choices ?? []) {
        for (const part of c.name.split(/\s*(?:&|\band\b)\s*/i).map(s => s.trim()).filter(Boolean)) {
          ownerOfWeapon.set(part.toLowerCase(), owner);
        }
      }
    }
    // Multi-profile weapons come in two spellings — "Missile launcher - Krak" and "Bolt rifle
    // (Bolt ammo)" — and the choice that grants them names neither. Strip both suffixes.
    const bareWeapon = (n: string) => n.split(' - ')[0].replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
    const unclaimed = remaining.filter(w => !used.has(w.name));
    if (unclaimed.length > 0 && groups.length > 0) {
      for (const w of unclaimed) {
        const owner = ownerOfWeapon.get(bareWeapon(w.name));
        const target = owner ? groups.find(g => g.label === owner) : undefined;
        if (target) { target.weapons.push(w); continue; }
        groups[0].weapons.push(w);
        if (variantGroup && variantSplitFromFirstClause) variantGroup.weapons.push(w);
      }
    }
    // …unless the promoted variant above already took them. On the two bike squads the Armory is
    // reached only by upgrading the Sergeant (`variant_link`), so the purchase belongs to the
    // *Veteran* Sergeant's row; appending the base Sergeant's row too printed the same weapon
    // twice. `variantGroup` is only ever set when that fold ran, so this can never swallow a
    // weapon that has nowhere else to render.
    if (championExtraWeapons.length > 0 && builtInChampion && !variantGroup) {
      groups.push({ label: builtInChampion.name, count: null, weapons: championExtraWeapons, traitMap: profile.weaponTraitMap });
    }
  } else if (builtInChampion && unit.models[0].max > 1) {
    const championCount = 1;
    const squadCount = Math.max(0, item.size - championCount);

    const champTraitMap = new Map(profile.weaponTraitMap);
    for (const [k, v] of profile.championWeaponTraitMap) {
      champTraitMap.set(k, [...(champTraitMap.get(k) ?? []), ...v]);
    }

    // Anything the Champion alone carries — an added Armory weapon, or a shared one only it bought
    // — means the two loadouts differ and each needs its own row.
    const identical = championExtraWeapons.length === 0 && championBought.length === 0 &&
      remaining.every(w => renderedAbilities(w, profile.weaponTraitMap) === renderedAbilities(w, champTraitMap));

    if (squadCount <= 0) {
      groups = [{ label: null, count: null, weapons: [...remaining, ...championExtraWeapons], traitMap: champTraitMap }];
    } else if (identical) {
      groups = [{ label: null, count: squadCount + championCount, weapons: remaining, traitMap: profile.weaponTraitMap }];
    } else {
      groups = [
        { label: unit.models[0].name, count: squadCount, weapons: squadWeapons, traitMap: profile.weaponTraitMap },
        { label: builtInChampion.name, count: championCount, weapons: [...remaining, ...championExtraWeapons], traitMap: champTraitMap },
      ];
    }
  } else {
    groups = [{ label: null, count: null, weapons: remaining, traitMap: profile.weaponTraitMap }];
    if (championExtraWeapons.length > 0 && builtInChampion) {
      groups.push({ label: builtInChampion.name, count: null, weapons: championExtraWeapons, traitMap: profile.weaponTraitMap });
    }
  }

  // Per-weapon count overrides: when independent option groups let only a SUBSET of a group's
  // models take a swap (e.g. Traitor Guard's "every model's Lasgun -> Chainsword & Laspistol"
  // and its separate "per 10 models, one Lasgun -> Flamer/Melter/Plasma gun"), the group's flat
  // `count` is wrong for both the base weapon (should shrink) and the swapped-in weapon (should
  // be its own qty, not the whole group). Sum qty per replaced weapon across ALL groups that
  // target it (each model decides independently, so qtys from different groups add up), and
  // give each swapped-in choice's weapon(s) their own qty.
  // Swapped-in weapons from a group with no explicit `applies_to_model` belong to the squad's
  // base model(s) only — e.g. "two Plague Marines may swap their Bolters" never means the Plague
  // Champion. When the Champion gets its own display row (its Armory gear differs from the
  // squad's), that row must not show the squad-only swapped weapon at all (it didn't buy it),
  // and the override below must not apply to it either (or the purchased qty shows doubled —
  // once correctly on the squad row, once spuriously on the Champion's).
  if (builtInChampion) {
    if (squadOnlyGrantedNames.size > 0) {
      for (const grp of groups) {
        if (grp.label === builtInChampion.name) {
          grp.weapons = grp.weapons.filter(w => !squadOnlyGrantedNames.has(baseName(w.name)) || grantedSet.has(w.name));
        }
      }
    }
  }

  for (const grp of groups) {
    // NOTE: do not require `grp.label` here — the common case where the squad's built-in
    // Champion has identical gear to the rest (no Armory purchases yet) merges everyone into
    // ONE group with `label: null` (see the `identical` branch above). That merged group's
    // `count` is still a real number (squad + Champion), so per-weapon swap quantities must
    // still be computed for it — skipping on `!grp.label` silently dropped every partial-squad
    // weapon swap's count override whenever the Champion's gear happened to match the squad's.
    // A null count means "single model" (most vehicles/characters). Those still need per-weapon
    // counts in two cases: the datasheet hands the model MORE THAN ONE copy of a weapon ("equipped
    // with: 2 Power scourges"), or the player bought the same option weapon twice through separate
    // groups (Defiler: Reaper autocannon in BOTH "replace one Power scourge" and "replace the other
    // Power scourge" — that is 2 Reaper autocannons and must read "2x").
    // Both tests deliberately look at the UNIT's declared loadout and the player's selections, not
    // at `grp.weapons`: once both scourges are swapped away the multi-copy weapon is gone from the
    // filtered list, and testing that list skipped the whole block and dropped every count.
    const unitHasMultiCopyWeapon = unit.weapons
      .some(w => weaponCopiesPerModel(unit.equipped_with, baseName(w.name)) > 1);
    const hasAnyOptionSelection = Object.keys(item.optionQty ?? {}).length > 0;
    // An Armory-only weapon (no squad option-group swap behind it, e.g. Chosen buying a plain
    // Boltgun) never sets hasAnyOptionSelection — its quantity comes from item.armory, not
    // item.optionQty. Skipping the loop here skipped the armory-purchase-count branch below too,
    // so buying the SAME weapon for 2+ different models silently rendered as an unprefixed single
    // row no matter how many were bought (Discord, Rigzar: "no puedo elegir el mismo item para
    // cada miembro... en los Chosen"). Scoped narrowly to groups that actually contain such a
    // weapon so untouched groups keep taking the fast path.
    const hasArmoryGrantedWeapon = grp.weapons.some(w => grantedSet.has(w.name) && !datasheetNames.has(w.name));
    if (grp.count == null && !unitHasMultiCopyWeapon && !hasAnyOptionSelection && !hasArmoryGrantedWeapon) continue;
    const replacedQty = new Map<string, number>();
    const grantedQty  = new Map<string, number>();
    for (const [gi, g] of unit.option_groups.entries()) {
      // Process BOTH swap groups (`replaces`) and add-only weapon-grant groups. Add-only groups
      // (e.g. IG "Another Guardsman may be equipped with a Special weapon: Flamer") were skipped,
      // so the granted weapon fell back to the squad's model count and printed "10x Flamer"
      // instead of the quantity actually bought.
      if (g.applies_to_model) {
        const targets = Array.isArray(g.applies_to_model) ? g.applies_to_model : [g.applies_to_model];
        // `grp.models` is only set for a clause spanning several model rows (3 datasheets), so
        // every other group keeps matching on the label exactly as before.
        const covers = grp.models
          ? targets.some(t => grp.models!.includes(t))
          : targets.includes(grp.label as string);
        if (!covers) continue;
      } else if (builtInChampion && grp.label === builtInChampion.name) {
        continue;
      } else {
        // A swap that belongs to a PROMOTED model and says so only in its header ("The Klaivex
        // replaces its Klaive with Demiklaives") must not be subtracted from the base squad's row:
        // promoting one Incubus left the other four showing three Klaives instead of four. Scoped
        // here rather than by setting `applies_to_model` in the data, because that field also
        // drives which weapons are VISIBLE and using it hid the squad's Klaives entirely.
        const header = (g.header ?? '').toLowerCase();
        const headerVariant = (unit.variant_models ?? [])
          .find(v => header.includes(v.name.toLowerCase()));
        if (headerVariant && (grp.label ?? '').toLowerCase() !== headerVariant.name.toLowerCase()) continue;
      }
      const ch = item.optionQty[gi] ?? {};
      let groupQty = 0;
      for (const [ci, qty] of Object.entries(ch)) {
        if (ci === '__inline' || !qty) continue;
        const n = Number(qty);
        groupQty += n;
        const choice = g.choices[parseInt(ci)];
        if (!choice) continue;
        const parts = choice.name.split(/\s*(?:&|\band\b)\s*/i).filter(Boolean);
        for (const part of (parts.length > 1 ? parts : [choice.name])) {
          // Match the choice against the weapon with BOTH multi-profile spellings stripped —
          // " - Krak" and "(Bolt ammo)". Comparing only the former meant an ammo-profile weapon
          // never registered a granted quantity and fell back to the model count (GH#89).
          const hit = grp.weapons.some(w =>
            baseName(w.name) === part ||
            baseName(w.name).replace(/\s*\([^)]*\)\s*$/, '').trim() === part);
          if (hit) grantedQty.set(part, (grantedQty.get(part) ?? 0) + n);
        }
      }
      // "Can be equipped with an additional Storm bolter for +11 points" — an INLINE option with
      // no choices, so nothing was granting the weapon and only the points moved; the card kept
      // saying one Storm bolter (Discord, MtoTheDonk). 22 datasheets are worded this way and every
      // one of them names a weapon the unit already carries, so the header is a safe signal.
      if ((g.choices ?? []).length === 0 && ch['__inline']) {
        const header = g.header ?? '';
        const isExtra = /\b(additional|second|extra)\b/i.test(header);
        const extra = isExtra ? grp.weapons.find(w => {
          const wb = baseName(w.name).replace(/\s*\([^)]*\)\s*$/, '').trim();
          return header.toLowerCase().includes(wb.toLowerCase());
        }) : undefined;
        if (extra) {
          const k = baseName(extra.name);
          grantedQty.set(k, (grantedQty.get(k) ?? 0) + Number(ch['__inline']));
        }
      }
      if (groupQty === 0) continue;
      for (const replaced of (g.replaces ?? [])) {
        replacedQty.set(replaced, (replacedQty.get(replaced) ?? 0) + groupQty);
      }
    }
    const overrides = new Map<string, number>();
    // How many models this group covers. `grp.count` is null for the single unlabelled group that
    // covers a whole squad (the common shape — one model row, one loadout clause), and the
    // arithmetic below then subtracted the swaps from ONE model instead of from the squad: picking
    // a single Scatter laser on five Windriders left max(0, 1-1) = 0 Twin shuriken catapults and
    // the weapon vanished for everyone (GitHub #90). 93 datasheets could be emptied this way —
    // Ork Boyz lost every Choppa to one Big choppa. Labelled groups always carry a real count, so
    // the fallback is scoped to the unlabelled whole-squad one and cannot inflate a champion's row.
    const groupModels = grp.count ?? (grp.label === null ? Math.max(1, item.size ?? 1) : 1);
    // NOTE: a multi-profile weapon ("Knight melee weapon - Strike"/"- Sweep") keeps the SAME real
    // quantity on each of its mode rows here — the data stays truthful. Not repeating that number
    // visually is a rendering concern and is handled once in the weapon tables, which skip the
    // count on a row whose weapon matches the previous row.
    for (const w of grp.weapons) {
      const bn = baseName(w.name);
      // A second spelling for multi-profile weapons: production writes ammo variants with
      // parentheses ("Bolt rifle (Bolt ammo)") rather than " - ", and `baseName` only strips the
      // latter, so an Indomitus Crusader Squad's bought Bolt rifle never matched the choice that
      // granted it and printed the whole Initiate count instead of the one bought (GH#89).
      // Looked up as a FALLBACK rather than normalised into the keys: `replaces` lists sometimes
      // name profiles individually ("Kroot rifle - Melee", "Kroot rifle - Ranged"), and collapsing
      // those into one key would double their quantity.
      const bareN = bn.replace(/\s*\([^)]*\)\s*$/, '').trim();
      // The EXACT name comes first: on 9 datasheets `replaces` names multi-profile rows one by one
      // ("Kroot rifle - Melee", "Kroot rifle - Ranged"), so asking only for the base name found
      // nothing and the swap was never subtracted — a Kroot Farstalker squad kept all five rifles
      // however many it traded away. Each profile row keeps its own quantity, which is why these
      // are not collapsed into one key (that would double them). Verified: every profile-named
      // `replaces` in the game matches a real weapon row, so this can never key on a phantom.
      const rKey = replacedQty.has(w.name) ? w.name
        : (replacedQty.has(bn) ? bn : (replacedQty.has(bareN) ? bareN : bn));
      const gKey = grantedQty.has(w.name) ? w.name
        : (grantedQty.has(bn) ? bn : (grantedQty.has(bareN) ? bareN : bn));
      if (!replacedQty.has(rKey) && !grantedQty.has(gKey)) {
        // Multi-copy base loadout: the datasheet says "…is equipped with: 2 Power scourges" but
        // nothing has swapped them, so no override was ever set and the profile printed a single
        // row with no count — the live profile must mirror the basic loadout ("x2"). Only kicks in
        // for weapons the equipped_with text really gives more than one copy of.
        const baseCopies = weaponCopiesPerModel(unit.equipped_with, bn);
        // grp.count is null for single-model groups (most vehicles) — treat that as one model.
        if (baseCopies > 1) { overrides.set(w.name, groupModels * baseCopies); continue; }
        // Armory-granted weapon with no squad option-group swap behind it (e.g. a Kill Team
        // Veteran's individually-bought Plasma pistol/Thunder hammer) — each entry in
        // item.armory is ONE model's purchase, not the whole squad's. Without this it fell
        // back to groupModels and a single Plasma pistol bought for one of five models showed
        // "5x Plasma pistol" (Discord, rem: "i only put 1 gravis selection, 1 plasma pistol,
        // 1 thunder hammer... here it says there's x5 of everything"). Scoped to weapons not on
        // the datasheet at all — one that's ALSO a squad swap option is handled by the branches
        // below instead, off the option group's own quantity.
        if (grantedSet.has(w.name) && !datasheetNames.has(w.name)) {
          const purchases = item.armory.filter(sel => sel.section === 'weapons' &&
            (sel.itemName === w.name || baseName(sel.itemName).replace(/\s*\([^)]*\)\s*$/, '').trim() === bareN)
          ).length;
          if (purchases > 0) overrides.set(w.name, purchases);
        }
        continue;
      }
      if (replacedQty.has(rKey)) {
        // Same N-copies-per-model adjustment as computeWeaponsToShow's threshold — grp.count is
        // a MODEL count, but the base weapon's true starting quantity is copies × model count.
        // Only safe when the datasheet actually splits the swap into >=N independent per-copy
        // groups (see computeWeaponsToShow's replaceGroupCountByName comment) — otherwise a
        // single bulk-swap group (e.g. Fellblade's "2 Laser destroyers" -> "2 Quad lascannons"
        // in one choice) would never reach the inflated count and show a bogus negative-derived
        // leftover (ki-replaces-swap-manual-review-01 regression, found 2026-06-27).
        const copies = weaponCopiesPerModel(unit.equipped_with, bn);
        const replaceGroups = unit.option_groups.filter(g => g.replaces?.includes(bn));
        // A group whose header explicitly swaps a SINGLE copy ("May replace one Siege claw…",
        // "May replace the other Power scourge") only ever removes one of the N copies, so the
        // base quantity must stay copies×models — unlike a bulk swap that trades all N at once
        // ("may swap their 2 Laser destroyers" -> one "2 Quad lascannons" choice), which is why
        // this is keyed on the header wording instead of assuming one shape for both.
        // The base quantity is ALWAYS copies × models — "Every model is equipped with: 2 Power
        // fists" on six Kastelan Robots really is twelve fists. What varies is how much one
        // selection takes away, and the datasheet says which:
        //   "Any model may swap their TWO Power fists", "may swap BOTH Penitent flails" → the
        //      selection trades every copy that model carries, so it removes `copies`.
        //   "May replace ONE Siege claw", "the OTHER Power scourge" → it removes a single copy.
        // Scaling the BASE by that distinction instead of the cost of a swap is what made four
        // Penitent Engines read 3 flails after one swap instead of 6, and six Kastelan Robots
        // read 5 Power fists instead of 10.
        const swapsAllCopies = copies > 1 &&
          replaceGroups.some(g => /\b(both|their two|two|all)\b/i.test(g.header ?? ''));
        const perSwap = swapsAllCopies ? copies : 1;
        overrides.set(w.name, Math.max(0, groupModels * copies - replacedQty.get(rKey)! * perSwap));
      } else if (grantedQty.has(gKey)) {
        // A granted weapon the model ALREADY carries adds to what it has rather than replacing it.
        // Discord (Liquid Citrus): a Tyranid Prime is equipped with Scything talons AND Spinefists,
        // and may swap the Spinefists for a second pair of Scything talons — it ends with two, and
        // the card said one. Only counted when this group's own default loadout names the weapon:
        // an Eldar Exarch trading its Diresword for an Avenger shuriken catapult gets ONE, because
        // the squad's catapults belong to the Avengers' row, not to the Exarch's.
        // The ITEM LIST, not the whole sentence: an unlabelled group covers the single clause, so
        // take what follows "is equipped with:" — splitting the raw sentence left the first item
        // glued to that prefix and it matched nothing.
        const groupClause = grp.label
          ? unit.equipped_with.match(loadoutClauseFor(grp.label))?.[1]
          // Not "is equipped with" — the Rhino reads "A Rhino is a single model AND equipped
          // with: Storm bolter", and anchoring on "is" missed it entirely.
          : unit.equipped_with.match(/equipped with:\s*([^.]+)\./i)?.[1];
        const inOwnDefault = !!groupClause &&
          splitLoadoutClause(groupClause).some(x => baseName(x).toLowerCase().replace(/s$/, '')
            === bn.toLowerCase().replace(/s$/, ''));
        // Deliberately narrow: only for a single-row unit that has NO promotion mechanic at all.
        // Champions, Exarchs and Sergeants are taken OUT of the squad's count, so adding the
        // squad's copies to one they bought for themselves double-counts; and on a unit whose
        // models have separate loadout lines the granted weapon can land on a row that already
        // carries one of its own (a Voidscarred Shade Runner's Shuriken pistol). Between them
        // those shapes reach 25 datasheets in 8 factions, none of them reported. The Tyranid Prime
        // and Tyranid Warrior Brood — the reported case — have one row and no promotion.
        // Widening this means reading those 25 one at a time first.
        const hasPromotion = (unit.variant_models ?? []).length > 0;
        // And the swap must genuinely trade away something the model HAS. The Custodes Sisters of
        // Silence are "equipped with: Boltgun; Psyk-out grenades" yet the option offers to swap a
        // Flamer they never had — counting that as an addition put 11 Boltguns on 10 models.
        // Flagged for the author; until then this stays out.
        const tradesSomethingReal = (g2 => g2 === undefined ? true : g2)(
          (() => {
            const src = unit.option_groups.filter(x => (x.choices ?? []).some(c =>
              baseName(c.name).toLowerCase() === bn.toLowerCase()));
            if (!src.length) return true;                     // inline grant, nothing traded away
            return src.some(x => (x.replaces ?? []).every(r =>
              (unit.equipped_with ?? '').toLowerCase().includes(baseName(r).toLowerCase())));
          })());
        const alreadyHas = inOwnDefault && !hasPromotion && grp.label === null && tradesSomethingReal
          ? groupModels * weaponCopiesPerModel(unit.equipped_with, bn)
          : 0;
        overrides.set(w.name, alreadyHas + grantedQty.get(gKey)!);
      }
    }
    if (overrides.size > 0) grp.countOverrides = overrides;
  }

  // Henchman Warband: a heterogeneous 0-N-of-17 specialist squad. Its equipped_with uses a
  // format the clause regex above doesn't recognise ("SpecialistA/SpecialistB: Weapon.", no
  // "is equipped with"), so every specialist's weapon landed in ONE undifferentiated group
  // regardless of whether that specialist was actually taken — a Warband with only an Acolyte
  // and an Exorcist still showed the Jokaero's digital weapons, the Ranger's long rifle, the
  // Arco-flagellant's flail, everything (Discord, rem/Dominic: "this section here should only
  // show the upgrade that was actually taken, if any"). Parsed here from the same equipped_with
  // string rather than hardcoded, so a future .ods update that adds/renames a specialist still
  // resolves correctly, instead of silently going stale.
  if (unit.name === 'Henchman Warband') {
    const presentSpecialists = new Set(
      unit.models.filter(m => (item.modelSizes?.[m.name] ?? 0) > 0).map(m => m.name));
    const weaponOwners = new Map<string, string[]>(); // baseName(weapon) -> specialist names
    for (const m of unit.equipped_with.matchAll(/([A-Za-z][A-Za-z '\-]*(?:\/[A-Za-z][A-Za-z '\-]*)*)\s*:\s*([^.]+)\./g)) {
      const owners = m[1].split('/').map(s => s.trim());
      for (const wName of m[2].split(',').map(s => s.trim())) {
        weaponOwners.set(wName, [...(weaponOwners.get(wName) ?? []), ...owners]);
      }
    }
    // The Servitor's swap group grants "Shock charger" automatically alongside whichever of its
    // 3 heavy-weapon choices is bought ("swap their Paired shock chargers for a Shock charger
    // AND one of the following") — "Shock charger" itself isn't one of the group's `choices`, so
    // nothing tied it to the purchase and it showed even with the swap never taken (same "only
    // show what was actually taken" gap, one weapon over).
    const servitorSwapGi = unit.option_groups.findIndex(g => (g.header ?? '').includes('Shock charger'));
    const servitorSwapBought = servitorSwapGi >= 0 &&
      Object.values(item.optionQty[servitorSwapGi] ?? {}).some(q => Number(q) > 0);
    for (const grp of groups) {
      grp.weapons = grp.weapons.filter(w => {
        if (baseName(w.name) === 'Shock charger') return servitorSwapBought;
        const owners = weaponOwners.get(baseName(w.name));
        // Not named in equipped_with at all: an option-group-bought weapon (the Servitor's Heavy
        // bolter/Multi-melta/Plasma cannon swap, the Missionary's Eviscerator) already gated by
        // its own purchase quantity — leave it alone.
        if (!owners) return true;
        return owners.some(o => presentSpecialists.has(o));
      });
    }
  }

  // Drop groups with nothing to show (e.g. Chaos Ogryn before any are bought) — a group that
  // exists in the data but has no weapons yet shouldn't force the others into labeled tables.
  const nonEmpty = groups.filter(g => g.weapons.length > 0);
  if (nonEmpty.length <= 1) {
    const g = nonEmpty[0];
    return applyNamedWeaponBoosts(unit, item, applyRangedStrengthBoosts(unit, item, [{ label: null, count: g?.count ?? null, weapons: g?.weapons ?? [], traitMap: g?.traitMap ?? profile.weaponTraitMap, countOverrides: g?.countOverrides }]));
  }
  return applyNamedWeaponBoosts(unit, item, applyRangedStrengthBoosts(unit, item, nonEmpty));
}

/**
 * Armory items worded "All ranged weapon(s) of the model gain +1 Strength" (optionally capped
 * "…4 or below") — Grey Knights/Inquisition "Psy-ammunition"/"Psybolt ammunition", Tau's
 * "Overdrive Power Systems" (Bork'an Sept relic), Tyranids' "Symbiostorm" (Kronos legacy).
 * Reported for Psy-ammunition (GitHub #92): buying it changed nothing, because the general
 * equipMods stat-delta parser read "+1 Strength" as a bump to the model's own S CHARACTERISTIC —
 * invisible on every weapon here, since none of these units' ranged weapons key their printed S
 * off "U" (user's Strength). The bonus is per-WEAPON, not per-model, so it needs its own pass
 * over the resolved weapon table rather than the shared characteristic-delta path (which now
 * ignores this wording instead — see AURA_PHRASES in equipMods.ts).
 * Melee weapons and non-numeric profiles ("U", "x2", "+2") are left untouched — the sheet says
 * "ranged weapon" and a non-numeric S has nothing for a cap to compare against.
 */
const RANGED_STRENGTH_BOOST_ITEMS: Record<string, number | null> = {
  'Psy-ammunition': 4,
  'Psybolt ammunition': 4,
  'Overdrive Power Systems': null,
  'Symbiostorm': null,
};
function applyRangedStrengthBoosts(unit: Unit, item: RosterEntry, groups: WeaponGroup[]): WeaponGroup[] {
  const fromArmory = item.armory.reduce((best: number | null | undefined, a) => {
    if (!(a.itemName in RANGED_STRENGTH_BOOST_ITEMS)) return best;
    const c = RANGED_STRENGTH_BOOST_ITEMS[a.itemName];
    if (best === undefined) return c;
    return c === null || best === null ? null : Math.max(best, c);
  }, undefined);
  // Grey Knights' 7 Psy-ammunition-carrying squads (Strike/Terminator/Ghost Terminator/Paladin/
  // Purifier/Interceptor/Purgator) grant it through the unit's OWN inline option group ("Each
  // model may be equipped with Psy-ammunition for +1 point(s) per model"), not a general Armory
  // purchase — item.armory never holds it for these, only item.optionQty does.
  const fromInlineOption = unit.option_groups.reduce((best: number | null | undefined, g, gi) => {
    const matched = Object.keys(RANGED_STRENGTH_BOOST_ITEMS).find(n => g.header.includes(n));
    if (!matched || !item.optionQty?.[gi]?.['__inline']) return best;
    const c = RANGED_STRENGTH_BOOST_ITEMS[matched];
    if (best === undefined) return c;
    return c === null || best === null ? null : Math.max(best, c);
  }, undefined);
  const cap = fromArmory !== undefined && fromInlineOption !== undefined
    ? (fromArmory === null || fromInlineOption === null ? null : Math.max(fromArmory, fromInlineOption))
    : fromArmory !== undefined ? fromArmory : fromInlineOption;
  if (cap === undefined) return groups;
  const boost = (w: Weapon): Weapon => {
    const isMelee = w.range === '-' || /^melee/i.test(w.type ?? '');
    if (isMelee || !/^\d+$/.test(w.s) || (cap !== null && parseInt(w.s, 10) > cap)) return w;
    return { ...w, s: String(parseInt(w.s, 10) + 1) };
  };
  return groups.map(g => ({ ...g, weapons: g.weapons.map(boost) }));
}

/**
 * Items/inline options that boost one specific NAMED weapon by text ("All of this model's Squig
 * Launchas receive +1 Strength and -1 AP") rather than the generic "weapon(s) of the model"
 * wording applyRangedStrengthBoosts covers — mirrors NAMED_WEAPON_BOOST_ITEMS in equipMods.ts,
 * which excludes these from the generic model-characteristic stat-delta parse so the two don't
 * double up. Ork "Nitro Squigs" (Warbuggy only): the datasheet's own weapon row is named
 * "Squig launcha" (singular, lowercase) — the item text's plural/capitalized "Squig Launchas" is
 * just descriptive, not a literal weapon name to match against. It's granted through the
 * Warbuggy's own inline "Can get one Kustom job" option group, not a general Armory purchase —
 * same shape as Psy-ammunition's fromInlineOption above, so item.armory never holds it either;
 * checked against unit.option_groups + item.optionQty by matching the choice NAME rather than a
 * hardcoded group/choice index, since those can shift as the sheet changes.
 */
const NAMED_WEAPON_BOOST_ITEMS: Record<string, { weaponName: string; sDelta: number; apDelta: number }> = {
  'Nitro Squigs': { weaponName: 'Squig launcha', sDelta: 1, apDelta: -1 },
};
function applyNamedWeaponBoosts(unit: Unit, item: RosterEntry, groups: WeaponGroup[]): WeaponGroup[] {
  const active = Object.keys(NAMED_WEAPON_BOOST_ITEMS).filter(name => {
    if (item.armory.some(a => a.itemName === name)) return true;
    return unit.option_groups.some((g, gi) => {
      const ci = (g.choices ?? []).findIndex(c => c.name === name);
      return ci >= 0 && (item.optionQty?.[gi]?.[ci] ?? 0) > 0;
    });
  });
  if (!active.length) return groups;
  const boosts = active.map(name => NAMED_WEAPON_BOOST_ITEMS[name]);
  const boost = (w: Weapon): Weapon => {
    const match = boosts.find(b => b.weaponName.toLowerCase() === w.name.toLowerCase());
    if (!match) return w;
    const s = /^\d+$/.test(w.s) ? String(parseInt(w.s, 10) + match.sDelta) : w.s;
    const ap = /^-?\d+$/.test(w.ap) ? String(parseInt(w.ap, 10) + match.apDelta) : w.ap;
    return { ...w, s, ap };
  };
  return groups.map(g => ({ ...g, weapons: g.weapons.map(boost) }));
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
  'Adeptus Mechanicus':  admechResolve,
};

// Maps a roster entry's `factionSource` slug (e.g. "chaos_daemons") to the display name used
// as a FACTION_RESOLVERS key — an allied/cross-faction unit (Plaguebearers brought into a CSM
// army, say) must resolve through ITS OWN faction's resolver (cdResolve), not the host army's
// (csmResolve), or its faction-specific mechanics (CD's Favored size/leader check vs CSM's
// armory-access check) evaluate against the wrong rule entirely.
const FACTION_SLUG_TO_NAME: Record<string, string> = {
  chaos_space_marines: 'Chaos Space Marines',
  chaos_daemons: 'Chaos Daemons',
  space_marines: 'Space Marines',
  adeptus_mechanicus: 'Adeptus Mechanicus',
};

// ── Public API ────────────────────────────────────────────────────────────────

export function resolveUnitProfile(
  item: RosterEntry,
  unit: Unit,
  state: ArmyState,
  data: FactionData,
): ResolvedProfile {
  const base = resolveBase(item, unit, state, data);
  // A second-level nested ally (factionSource = the Allied Detachment's own faction, nestedFaction
  // = a faction IT intrinsically grants, e.g. CSM Plaguehost → Chaos Daemons Plaguebearers) must
  // resolve through the NESTED faction's resolver, not factionSource's — the unit's actual rules
  // (CD's Favored size/leader check, say) live there, mirroring resolveUnit's own lookup order
  // (points.ts:25-26 checks nestedFaction before factionSource).
  const sourceSlug = item.nestedFaction ?? item.factionSource;
  const resolverFaction = sourceSlug ? (FACTION_SLUG_TO_NAME[sourceSlug] ?? state.faction) : state.faction;
  const factionFn = FACTION_RESOLVERS[resolverFaction];
  const profile = factionFn ? factionFn(base, item, unit, state, data) : base;
  // Faction resolvers may rewrite `weapons`; derive the display list from the final set.
  profile.weaponsToShow = computeWeaponsToShow(profile.weapons, unit, item, profile.armoryGrantedWeapons);
  // Cosmetic archetype renames/ability-injections apply AFTER gating (see weaponDisplayOverride
  // doc) so they never interfere with matching choice names against original weapon names.
  if (profile.weaponDisplayOverride) profile.weaponsToShow = profile.weaponDisplayOverride(profile.weaponsToShow);
  profile.weaponGroups = computeWeaponGroups(unit, item, profile);
  profile.attachedDrones = computeAttachedDrones(unit, item, data);
  return profile;
}

/** See ResolvedProfile.attachedDrones doc comment. */
function computeAttachedDrones(unit: Unit, item: RosterEntry, data: FactionData): Array<{ drone: DroneType; count: number }> {
  if (!data.drones || data.drones.length === 0) return [];
  const counts = new Map<string, number>();
  unit.option_groups.forEach((g, gi) => {
    g.choices.forEach((c, ci) => {
      const qty = item.optionQty?.[gi]?.[ci];
      if (!qty) return;
      if (!data.drones!.some(d => d.name === c.name)) return;
      counts.set(c.name, (counts.get(c.name) ?? 0) + qty);
    });
  });
  if (counts.size === 0) return [];
  return [...counts.entries()]
    .map(([name, count]) => ({ drone: data.drones!.find(d => d.name === name)!, count }))
    .filter(e => e.count > 0);
}
