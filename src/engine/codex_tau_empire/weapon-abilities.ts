/**
 * codex_tau_empire/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/tau_empire.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Anti-Air/Sunder/Melta/AT — canonical in coreRules.ts).
 *
 * Closes Fase 4 for T'au Empire — 5/5 — SEVENTEENTH faction. Infantry ᴵ-glyph gate; the unique
 * Support Systems mechanic; Drones; no veteran tier.
 */

export interface TauWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/tau_empire.md §2 (gating) + §3 (points).
export const TAU_WEAPON_ABILITIES: TauWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'Infantry (ᴵ glyph) gating',
    category: 'gating',
    text: '".ods: Infantry models may only use equipment marked with ᵀ" (general equipment + ' +
      'Support Systems). Production encodes this via the ᴵ glyph suffixed to Infantry-usable item ' +
      'names. Glyph-encoded (ᴵ), not `armourKeyword`/`term_compat`.',
  },
  {
    name: 'Battlesuit upgrades (XV22/XV81/XV84/XV85/XV86) — mutually exclusive',
    category: 'gating',
    text: 'XV22 Stalker / XV81 Crisis / XV84 Crisis / XV85 Enforcer / XV86 Coldstar / XV86 Supernova ' +
      '— each transforms the battlesuit (type/stats/extra slots) and is gated "Can\'t be combined ' +
      'with other battlesuits" (mutually exclusive prose).',
  },
  {
    name: 'Support Systems (14) — distinct per-unit mechanic (NOT vehicle-only)',
    category: 'gating',
    text: 'Blacksun filter / Command and control node / Counterfire defence / Early warning override ' +
      '/ Earth caste pilot array / Multi-tracker / Neuroweb jammer / Photon caster / Positional ' +
      'relay / Repulsor impact field / Shield generator / Target lock / Vectored retro-thrusters / ' +
      'Velocity tracker — a DISTINCT Tau mechanic (POINTS + POINTS HQ columns; infantry pick ONE). ' +
      'Left `category: none` (NOT vehicle-only). Several names also appear in Vehicle Equipment — ' +
      'only the vehicle block was tagged.',
  },
  {
    name: 'Drones (Tau Drones catalogue)',
    category: 'gating',
    text: 'Models "with access to drones" buy drones from the `Tau Drones` catalogue (the Swarm ' +
      'Controllers trait raises the cap from 2 to 3). A faction-specific add-on pool.',
  },
  {
    name: 'Vehicle Equipment (11) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Blacksun filter / Decoy launchers / Disruption pod / Failsafe detonator / Flechette ' +
      'discharger / Jammer / Landing gear / Multi-tracker / Seeker missile / Smoke Launcher / Target ' +
      'lock — gated by `category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 ' +
      '(`ki-tau-empire-vetvehcategory-01`): all 11 (idx 49-59) tagged. POINTS already in `p_unit` — ' +
      'no value-move.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'No VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units. No `category:' +
      '"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard + Support-System pricing (`p_unit`/`p_char`, + POINTS HQ)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER" (`p_char`). Support Systems add a "POINTS ' +
      'HQ" override column. Mirrors the cross-faction `getItemPts`.',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same shape as the other ' +
      'factions\' vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns. Per-unit cost paid ' +
      'army-wide. Same rich shape as IG/AdMech/Sororitas/Aeldari/GSC/Orks/Votann.',
  },

  // --- §structural ---
  {
    name: 'Infantry gate glyph-encoded (ᴵ); Kroot in unit_type — pre-keyword-seam',
    category: 'structural',
    text: 'The Infantry gate is the ᴵ name-glyph (not `armourKeyword`); the Kroot sub-faction lives ' +
      'in `unit_type` ("..., Kroot"), not `keywords[]`. Both are pre-keyword-seam encodings — ' +
      'candidates for promotion into keyword axes in a future cross-faction refactor ' +
      '([[project_pipeline_migration]]).',
  },
];
