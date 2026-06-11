/**
 * codex_necrons/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/necrons.md` §2 (gating) + §3 (points). NOT the named weapon abilities
 * themselves (Gauss/Tesla/Seeking — canonical in coreRules.ts).
 *
 * Closes Fase 4 for Necrons — 5/5 — EIGHTEENTH and FINAL faction. No keyword gate, no veteran tier.
 */

export interface NecronWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/necrons.md §2 (gating) + §3 (points).
export const NECRON_WEAPON_ABILITIES: NecronWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'No armour/mark/datasheet keyword (NECRON_KEYWORDS has only the unit_type-encoded Necron/' +
      'Canoptek sub-types). `has_armory_access` opens the general tab; no `armour_compat`/' +
      '`term_compat`/glyph. Access decided by prose + flags.',
  },
  {
    name: '"Only for X" prose restrictions',
    category: 'gating',
    text: 'Free-text restrictions: Skorpekh body "Infantry only"; the Harbinger-of-X Cryptek ' +
      'upgrades; Lord-only relics (Phylactery, Veil of darkness, etc.). Same prose-match pattern as ' +
      'the other factions.',
  },
  {
    name: 'Vehicle Equipment (4) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Improved targeting / Jammer / Smoke Launcher — gated by ' +
      '`category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 (`ki-necrons-vetvehcategory-01`): ' +
      'all 4 (idx 33-36) tagged. POINTS already in `p_unit` — no value-move.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'No VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units. No `category:' +
      '"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER" (`p_char`). Mirrors the cross-faction ' +
      '`getItemPts`. No `× item.size` for regular gear.',
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
      'army-wide. Same rich shape as IG/AdMech/Sororitas/Aeldari/GSC/Orks/Votann/Tau.',
  },

  // --- §structural ---
  {
    name: 'Necron/Canoptek sub-types in unit_type — pre-keyword-seam',
    category: 'structural',
    text: 'The Necron/Canoptek sub-factions live in `unit_type` ("..., Necron"/"..., Canoptek"), not ' +
      '`keywords[]` — a pre-keyword-seam encoding (same as Tau\'s Kroot), candidate for promotion ' +
      'into a keyword axis in a future cross-faction refactor ([[project_pipeline_migration]]).',
  },
];
