/**
 * codex_adeptus_sororitas/weapon-abilities — category 5 of 5 (FINAL) (Weapon ability).
 *
 * Migrated from `rules-model/adeptus_sororitas.md` §2 (gating) + §3 (points). NOT the named weapon
 * abilities themselves (Flames/Melta/AT/Armorbane/Psi-shock — canonical in coreRules.ts).
 *
 * Completing this file closes Fase 4 for Adeptus Sororitas — 5/5 — EIGHTH faction migrated.
 * Like IG/AdMech, no keyword-based gating row. UNIQUELY (with Chaos Daemons): NO veteran-ability
 * pricing tier at all.
 */

export interface SororitasWeaponAbilityEntry {
  name: string;
  category: 'gating' | 'points' | 'structural';
  text: string;
}

// Source: rules-model/adeptus_sororitas.md §2 (gating) + §3 (points).
export const SORORITAS_WEAPON_ABILITIES: SororitasWeaponAbilityEntry[] = [
  // --- §2 gating ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'No armour/mark/faction/datasheet keyword (SORORITAS_KEYWORDS empty). `has_armory_access` ' +
      'opens the general tab; no `armour_compat`/`term_compat` anywhere. Third faction (after IG, ' +
      'AdMech) with no keyword gate — access decided by prose + flags.',
  },
  {
    name: '"Only for X" / "Only for infantry" prose restrictions',
    category: 'gating',
    text: 'Free-text restrictions matched against item `desc`: Eviscerator / Plasma gun "Only for ' +
      'Missionary"; Holy weapon "Only for Palatines"; Dominion / Jump pack "Only for infantry". ' +
      'Order Armory relics gated by their matching Legacy (the 6 Orders Militant). Same prose-match ' +
      'pattern as IG/AdMech/GK/CSM.',
  },
  {
    name: 'Vehicle Upgrades (9) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Anointment / Blessed ammunition / Holy icon / Holy promethium / ' +
      'Hunter-killer missile / Improved targeting / Jammer / Smoke Launcher — gated by ' +
      '`category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 (`ki-sororitas-vetvehcategory-01`): ' +
      'all 9 tagged. POINTS already in `p_unit` (like AdMech, unlike IG) — pure tagging, no move. ' +
      'Anointment + Blessed ammunition also appear as equipment-section character versions — only ' +
      'the vehicle block (idx 26-34) was tagged.',
  },
  {
    name: 'NO Veteran-Ability tier (by design)',
    category: 'gating',
    text: 'Sororitas armory has NO VETERAN ABILITIES / DOCTRINA section, and 0 units carry ' +
      '`has_veteran_abilities`. A genuine faction characteristic shared with Chaos Daemons — NOT an ' +
      'unaudited omission. No `category:"veteran"` work applies (unlike IG/GK/AdMech).',
  },

  // --- §3 points ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Armory "POINTS" (`p_unit`) + "POINTS CHARACTER MODELS" (`p_char`) columns — `p_char` ' +
      'legitimately used for regular gear. Mirrors the cross-faction `getItemPts`. No `× item.size` ' +
      'for regular gear.',
  },
  {
    name: 'Vehicle Upgrade pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single .ods "POINTS" column, flat per-vehicle, already in `p_unit`. Same simple shape as ' +
      'IG/AdMech/GK/Inquisition vehicle equipment.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide (`*` = per Wound/Hull)',
    category: 'points',
    text: 'NORMAL / CHARACTER MODELS / MONSTROUS CREATURES & VEHICLES columns, `*` = per Wound/Hull, ' +
      'per-unit cost paid army-wide. Same rich shape as IG/AdMech.',
  },
  {
    name: 'No veteran/per-Wound-or-Hull pricing tier',
    category: 'structural',
    text: 'Sororitas lack the Veteran-Ability pricing tier entirely — they sit on the Chaos-Daemons ' +
      'side of the inverse-pair [[project_space_marines_codex_migration]] identified (CD has no such ' +
      'tier), opposite IG/AdMech/GK/SM/Inquisition which all carry it.',
  },
];
