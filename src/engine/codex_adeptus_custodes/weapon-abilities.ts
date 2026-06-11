/**
 * codex_adeptus_custodes/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/adeptus_custodes.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Explosive/AT/Decimate/Precision — canonical in coreRules.ts).
 *
 * Completing this file closes Fase 4 for Adeptus Custodes — 5/5 — NINTH faction migrated.
 * Custodes is a GK/Inquisition sibling: single ᵀ-gate armour axis + veteran-ability tier (17/19
 * units), unlike the IG/AdMech/Sororitas all-empty group.
 */

export interface CustodesWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/adeptus_custodes.md §2 (gating) + §3 (points).
export const CUSTODES_WEAPON_ABILITIES: CustodesWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'ᵀ-glyph gating (Terminator armour subset)',
    category: 'gating',
    text: 'Standard Terminator gate — 18/34 armory items carry `term_compat: true`, restricted to ' +
      'Terminator-armoured units (Allarus/Aquilon Custodians). ".ods: Models wearing Terminator ' +
      'armor can only receive equipment with ᵀ." Engine-derived via the shared ' +
      '`isTerminatorArmourName`/`modelRestrictsToTermSubset` primitives (CSM/SM/GK/Inquisition ' +
      'share them). Single binary gate, no Cataphractii/Gravis.',
  },
  {
    name: '"Only for models in Terminator armor" prose',
    category: 'gating',
    text: 'Free-text restriction reinforcing the ᵀ-gate on specific items (e.g. Balistus grenade ' +
      'launcher). Same prose-match pattern as the other factions.',
  },
  {
    name: 'Veteran Abilities (8) — `category: \'veteran\'` + `has_veteran_abilities`',
    category: 'gating',
    text: 'Counter-attack / Favoured enemy / Furious charge / Infiltrator / Outflank / Tank hunter / ' +
      'Terrain expert / Vanguard — gated by `category: "veteran"` + unit `has_veteran_abilities` ' +
      '(17/19 units — all except the Blade Champion + Knight-Centura HQs). FIXED 2026-06-11 ' +
      '(`ki-custodes-vetvehcategory-01`): all 8 tagged; Infiltrator/Vanguard `p_veh: null`, the ' +
      'other 6 `p_veh: 2`; `p_char: null`. UNLIKE AdMech (0 veteran units), Custodes genuinely uses ' +
      'this tier — the GK/IG pattern transfers cleanly.',
  },
  {
    name: 'Vehicle Equipment (6) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Hunter-killer missile / Improved targeting / Jammer / Magos-class ' +
      'machine spirit / Smoke Launcher — gated by `category: "vehicle"` + unit `is_vehicle`. FIXED ' +
      '2026-06-11: tagged. POINTS already in `p_unit` (like AdMech/Sororitas, unlike IG) — pure ' +
      'tagging, no value-move.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing — single `p_unit` column',
    category: 'points',
    text: 'The `.ods` Armory has a SINGLE "POINTS" column for weapons + equipment (NO "POINTS ' +
      'CHARACTER MODELS" — unlike IG/AdMech/Sororitas). So `p_unit` only, `p_char` mostly null. ' +
      'Fits Custodes being all elite single-profile models (no character/squad price split).',
  },
  {
    name: 'Veteran-ability pricing — per-model / per-Wound-or-Hull-point split',
    category: 'points',
    text: 'The `.ods` VETERAN ABILITIES table has "POINTS" (`p_unit`) + "POINTS MONSTROUS CREATURES ' +
      '& VEHICLES" (`p_veh`) columns + the per-model/per-Wound footnote. Infantry pay `p_unit × ' +
      'size`; vehicles/monsters pay `p_veh × woundCount × size`. 6 items `p_veh: 2`, Infiltrator/' +
      'Vanguard `p_veh: null`. Same shape as GK/IG/AdMech — Custodes sits on the SM/GK side of the ' +
      'veteran-tier inverse-pair (CD/Sororitas lack it).',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same simple shape as the ' +
      'other factions\' vehicle equipment.',
  },

  // --- §structural ---
  {
    name: '`term_compat` boolean, no `armourKeyword` (pre-keyword-seam)',
    category: 'structural',
    text: 'The ᵀ-gate is keyed via the `term_compat` boolean + name-derivation, NOT an ' +
      '`armourKeyword: "Terminator"` field on Allarus/Aquilon — the same pre-keyword-seam state CSM ' +
      'had ([[project_pipeline_migration]]). Left as-is (the cross-faction keyword-engine refactor ' +
      'is out of this migration\'s scope). GK already uses the target `armour_compat: string[]` ' +
      'array shape; Custodes does not yet.',
  },
];
