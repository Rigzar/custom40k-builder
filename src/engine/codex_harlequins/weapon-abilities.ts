/**
 * codex_harlequins/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/harlequins.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Shuriken/Haywire/Force weapon/Neuro disruptor — canonical in coreRules.ts).
 *
 * Closes Fase 4 for Harlequins — 5/5 — TWELFTH faction migrated (SMALLEST roster, 9 units). No
 * keyword gate, no veteran tier, no Army Customisation — the simplest faction alongside Inquisition.
 */

export interface HarlequinsWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/harlequins.md §2 (gating) + §3 (points).
export const HARLEQUINS_WEAPON_ABILITIES: HarlequinsWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'No armour/mark/datasheet keyword (HARLEQUINS_KEYWORDS empty). `has_armory_access` opens ' +
      'the general tab; no `armour_compat`/`term_compat`. Access decided by prose ("Only for ' +
      'infantry") + flags. The IG/AdMech/Sororitas/Eldar group.',
  },
  {
    name: 'Vehicle Equipment (6) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Holo-field / Improved targeting / Jammer / Night shield / Smoke Launcher / Spirit stones ' +
      '— gated by `category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 ' +
      '(`ki-harlequins-vetvehcategory-01`): all 6 (idx 15-20) tagged. POINTS already in `p_unit` — ' +
      'no value-move.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'No VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like CD/Sororitas/' +
      'Dark Eldar/Eldar. No `category:"veteran"` work applies.',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER" (`p_char`) columns. Mirrors the cross-' +
      'faction `getItemPts`. No `× item.size` for regular gear.',
  },
  {
    name: 'Vehicle Equipment pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same shape as the other ' +
      'factions\' vehicle equipment.',
  },
  {
    name: 'No traits / no veteran tier',
    category: 'structural',
    text: 'No Army Customisation (no traits) and no Veteran-Ability pricing tier — the minimal ' +
      'points model, alongside Inquisition.',
  },
];
