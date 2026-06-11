/**
 * codex_eldar/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/eldar.md` §2 (gating) + §3 (points). NOT the named weapon abilities
 * themselves (Shuriken/Sunder/Decimate/Deadly — canonical in coreRules.ts).
 *
 * Completing this file closes Fase 4 for Eldar — 5/5 — ELEVENTH faction migrated (LARGEST roster,
 * 38 units). Like the IG/AdMech/Sororitas/Dark-Eldar group, no keyword-based armoury gate; no
 * veteran tier.
 */

export interface EldarWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/eldar.md §2 (gating) + §3 (points).
export const ELDAR_WEAPON_ABILITIES: EldarWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'No armour/mark/datasheet keyword in production (ELDAR_KEYWORDS empty). `has_armory_access` ' +
      'opens the general tab; no `armour_compat`/`term_compat`. Access decided by prose + flags. ' +
      '(The Aspect/Wraith sub-types referenced in archetypes are not keyword-modelled — ' +
      '`ki-eldar-aspect-wraith-keyword-01`.)',
  },
  {
    name: 'Craftworld + Ynnari legacy armories',
    category: 'gating',
    text: '5 Craftworld armories (one per Legacy: Alaitoc/Ulthwé/Iyanden/Biel-Tan/Saim-Hann) + the ' +
      'Ynnari armory (via the Ynnari archetype), loaded as the "Craftworld"/"Ynnari" legacy ' +
      'armories. Relics gated by the matching Legacy/archetype unlock.',
  },
  {
    name: 'Vehicle Equipment (8) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Crystal targeting matrix / Ghostwalk matrix / Holo-field / Improved targeting / Jammer / ' +
      'Spirit stones / Smoke Launcher / Star engines — gated by `category: "vehicle"` + unit ' +
      '`is_vehicle`. FIXED 2026-06-11 (`ki-eldar-vetvehcategory-01`): all 8 (idx 41-48) tagged. ' +
      'POINTS already in `p_unit` — no value-move. Only the vehicle-block "Spirit stones" (idx 46) ' +
      'tagged, not the equipment-section version (idx 19).',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'Eldar armory has NO VETERAN ABILITIES section, and 0 units carry `has_veteran_abilities` ' +
      '— like Chaos Daemons/Sororitas/Dark Eldar. No `category:"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER MODELS" (`p_char`) columns. Mirrors the ' +
      'cross-faction `getItemPts`. No `× item.size` for regular gear.',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same simple shape as the ' +
      'other factions\' vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns. Per-unit cost paid ' +
      'army-wide. Same rich shape as IG/AdMech/Sororitas/Dark Eldar.',
  },
  {
    name: 'No veteran/per-Wound-or-Hull pricing tier',
    category: 'structural',
    text: 'Eldar lack the Veteran-Ability pricing tier — on the CD/Sororitas/Dark-Eldar side of the ' +
      'veteran-tier inverse-pair ([[project_space_marines_codex_migration]]).',
  },
];
