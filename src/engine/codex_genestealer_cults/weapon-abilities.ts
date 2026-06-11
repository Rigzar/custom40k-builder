/**
 * codex_genestealer_cults/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/genestealer_cults.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Poison/Monofilament/Explosive/Force weapon — canonical in coreRules.ts).
 *
 * Closes Fase 4 for Genestealer Cults — 5/5 — THIRTEENTH faction. No keyword gate, no veteran tier.
 */

export interface GscWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/genestealer_cults.md §2 (gating) + §3 (points).
export const GSC_WEAPON_ABILITIES: GscWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'No armour/mark/datasheet keyword (GSC_KEYWORDS empty). `has_armory_access` opens the ' +
      'general tab; no `armour_compat`/`term_compat`. Access decided by prose ("Only for infantry"/' +
      '"Psykers only"/"Cult icon") + flags. The IG/AdMech/Sororitas/Eldar/Harlequins group.',
  },
  {
    name: 'Vehicle Equipment (7) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Flare launcher / Improved targeting / Jammer / Smoke Launcher / ' +
      'Spotter / Survey augur — gated by `category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 ' +
      '(`ki-genestealer-cults-vetvehcategory-01`): all 7 (idx 22-28) tagged. POINTS already in ' +
      '`p_unit` — no value-move.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'No VETERAN ABILITIES armory section; 0 `has_veteran_abilities` units — like CD/Sororitas/' +
      'Dark Eldar/Eldar/Harlequins. No `category:"veteran"` work applies.',
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
    text: 'Single "POINTS" column, flat per-vehicle, already in `p_unit`. Same shape as the other ' +
      'factions\' vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns. Per-unit cost paid ' +
      'army-wide. Same rich shape as IG/AdMech/Sororitas/Eldar/Dark Eldar.',
  },
  {
    name: 'No veteran/per-Wound-or-Hull pricing tier',
    category: 'structural',
    text: 'GSC lack the Veteran-Ability pricing tier — on the CD/Sororitas/Dark-Eldar/Eldar/' +
      'Harlequins side of the veteran-tier inverse-pair ([[project_space_marines_codex_migration]]).',
  },
];
