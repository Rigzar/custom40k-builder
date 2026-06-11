/**
 * codex_tyranids/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/tyranids.md` §2 (the Biomorph system) + §3 (points). NOT the named
 * weapon abilities themselves (Poison/Flurry/Retribution/Suppression — canonical in coreRules.ts).
 *
 * Closes Fase 4 for Tyranids — 5/5 — FIFTEENTH faction. UNIQUE: no shared Armory (general.json
 * empty), no vehicles, no veteran tier — wargear is the per-unit BIOMORPH system. The only migrated
 * faction with NO armory category fix to do.
 */

export interface TyranidWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/tyranids.md §2 (Biomorph system) + §3 (points).
export const TYRANID_WEAPON_ABILITIES: TyranidWeaponAbilityEntry[] = [
  // --- §2 gating: the Biomorph system ---
  {
    name: 'Biomorph system (replaces the shared Armory)',
    category: 'gating',
    text: 'Tyranids do NOT use the standard shared-Armory model: production `armory/general.json` is ' +
      'EMPTY and `has_armory_access: false` on the units. Wargear is the per-unit BIOMORPH system, ' +
      'modelled as `option_groups` on each datasheet (verified on Hive Tyrant: "May select one ' +
      'Special Biomorph", "May additionally select any number of Basic and Advanced Biomorphs"). ' +
      'Three tiers: Basic (7, per-unit flat), Advanced (9, per-model), Special (9, "see datasheet").',
  },
  {
    name: 'Special Biomorph "Winged" gates the Flying Death archetype',
    category: 'gating',
    text: 'The "Winged" Special Biomorph (+6"M, Anti-Grav, Deep Strike) is the gate for the Flying ' +
      'Death archetype ("Gargoyle/Tyranid Warrior Broods with the Winged biomorph can be taken as ' +
      'Troops"). Synaptic Node is limited to 1 unit per army.',
  },
  {
    name: 'NO Vehicle Equipment / NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'Tyranids have 0 vehicles (`is_vehicle: 0` on all 40 units) → no Vehicle Equipment section; ' +
      'and 0 `has_veteran_abilities` units → no Veteran Abilities section. So there is NO ' +
      '`category:"vehicle"`/`"veteran"` tagging work — the ONLY migrated faction with nothing to fix ' +
      'in the armory.',
  },

  // --- §3 points ---
  {
    name: 'Biomorph pricing (per-unit / per-model / datasheet)',
    category: 'points',
    text: 'Basic Biomorphs = flat per-unit; Advanced Biomorphs = per-model; Special Biomorphs = ' +
      '"See datasheet" (priced on the unit\'s own datasheet). Modelled via `option_groups`, not a ' +
      'shared-armory `p_unit`/`p_char`. The cleanest points model of any faction — everything on the ' +
      'datasheets + biomorph options.',
  },
  {
    name: 'No standard armory / no veteran / no traits pricing',
    category: 'structural',
    text: 'No shared-armory pricing (general.json empty), no Veteran-Ability per-Wound/Hull tier, no ' +
      'Trait pricing (no traits). Hive Fleet legacy armories (`legion_hive_fleet.json`) are the only ' +
      'shared-equipment pools, unlocked per Legacy.',
  },
];
