/**
 * codex_imperial_guard/weapon-abilities — category 5 of 5 (FINAL) in the codex.ts data model
 * (Weapon ability).
 *
 * Catalogue of Imperial Guard's WARGEAR-LEVEL GATE MECHANICS + points model. Migrated from
 * `rules-model/imperial_guard.md` §2 (wargear gating) + §3 (points model). NOT the named weapon
 * abilities themselves (Force Weapon/Armorbane/AT/Overheating/etc. canonical in coreRules.ts).
 *
 * Completing this file closes Fase 4 for Imperial Guard — 5/5 categories — SIXTH faction fully
 * migrated, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey Knights.
 *
 * IG is the purest "no keyword gate" faction: §2 has NO keyword-based gating row at all (cf.
 * GK/Inquisition's ᵀ-gate). Anti-duplication held: keyword axes (all empty) live in IG_KEYWORDS,
 * army rules in IG_SPECIAL_ABILITIES, named abilities in coreRules.ts.
 */

export interface IgWeaponAbilityEntry {
  /** Mechanic name as documented in the digest */
  name: string;
  category: 'gating' | 'points' | 'structural';
  /** Verbatim or close-paraphrase mechanic text + grounding reference */
  text: string;
}

// Source: rules-model/imperial_guard.md §2 (wargear gating) + §3 (points model).
export const IG_WEAPON_ABILITIES: IgWeaponAbilityEntry[] = [
  // --- §2 gating mechanics ---
  {
    name: 'No keyword-based wargear gate',
    category: 'gating',
    text: 'IG has NO armour/mark/faction/datasheet keyword (IG_KEYWORDS empty). `has_armory_access` ' +
      'opens the general Armory tab; there is no ᵀ/ᴳ-style `armour_compat`/`term_compat` filter on ' +
      'any item. The PUREST "no keyword gate" faction migrated — wargear access is decided entirely ' +
      'by prose + boolean unit flags (below).',
  },
  {
    name: '"Only for X" prose restrictions',
    category: 'gating',
    text: 'Free-text unit-restrictions matched against item `desc` (same pattern as CSM/SM/GK/' +
      'Inquisition): Eviscerator "Only for Preacher"; Force axe/staff/sword + Familiar + Gamma psyker ' +
      '"Only for Primaris Psykers"; Grav-chute + Mechanical steed "Only for infantry"; etc. The ' +
      'engine enforces these by desc text, not a keyword axis.',
  },
  {
    name: 'Veteran Abilities (8) — `category: \'veteran\'` + `has_veteran_abilities`',
    category: 'gating',
    text: 'Counter-attack / Favoured enemy / Furious charge / Infiltrator / Outflank / Tank hunter / ' +
      'Terrain expert / Vanguard — gated by `category: "veteran"` + unit `has_veteran_abilities`. ' +
      'FIXED 2026-06-11 (`ki-ig-vetvehcategory-01`, twin of GK): all 8 now carry `category:"veteran"`; ' +
      'Infiltrator/Vanguard have `p_veh: null` (no vehicle/monster application, "-" in the .ods M&V ' +
      'column), the other 6 have `p_veh: 2`. The Veteran Company archetype additionally FORCES every ' +
      'unit to take one (IG_SPECIAL_ABILITIES).',
  },
  {
    name: 'Vehicle Upgrades (16) — `category: \'vehicle\'` + `is_vehicle`',
    category: 'gating',
    text: 'Additional armor / Bulldozer blade / Camo net / Chain guard / Heavy stubber / Hunter-killer ' +
      'missile / Improved targeting / Jammer / Macharius cross / Purity seal / Regimental artefact / ' +
      'Seasoned officer / Smoke Launcher / Storm bolter / Twin heavy stubber / Vox — gated by ' +
      '`category: "vehicle"` + unit `is_vehicle`. FIXED 2026-06-11 (`ki-ig-vetvehcategory-01`): all 16 ' +
      'tagged, and the single-column .ods POINTS value moved from `p_char` into `p_unit` (engine ' +
      'prices vehicle items off `p_unit`; parser had left them `p_unit:null`). IG has the MOST ' +
      'vehicle upgrades of any migrated faction (16 vs GK 10, Inquisition 5) — fitting its 22-vehicle ' +
      'roster.',
  },
  {
    name: 'Mark of Chaos (Traitor Guard archetype only)',
    category: 'gating',
    text: 'Not a base gate — purchasable per-model/per-Wound (+1 Khorne/Slaanesh, +2 Nurgle/Tzeentch) ' +
      'or per-vehicle (+10 any) ONLY when the Traitor Guard archetype is active. See IG_KEYWORDS ' +
      '`mark` note + [[project_traitor_guard_bugfix_0608]].',
  },

  // --- §3 points model ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'The Armory has real "POINTS" (`p_unit`, per-model) + "POINTS CHARACTER MODELS" (`p_char`, ' +
      'flat character override) columns — so `p_char` IS legitimately used for regular IG gear ' +
      '(unlike GK, whose veteran table had no character column). Mirrors CSM/SM/GK `getItemPts`. ' +
      'No `× item.size` for regular gear.',
  },
  {
    name: 'Veteran-ability pricing — per-model / per-Wound-or-Hull-point split',
    category: 'points',
    text: 'The .ods VETERAN ABILITIES table has "POINTS" (`p_unit`) + "POINTS MONSTROUS CREATURES & ' +
      'VEHICLES" (`p_veh`) columns + footnote "paid for every model in the unit and per Wound or Hull ' +
      'point". Infantry/characters pay `p_unit × size`; vehicles/monsters pay `p_veh × woundCount × ' +
      'size`. 6 items `p_veh:2`, Infiltrator/Vanguard `p_veh:null`. `p_char:null` on all 8 (that ' +
      'table has no character column — the value previously in `p_char` was the misplaced M&V figure, ' +
      'now in `p_veh`). FOURTH faction confirming the SM-side of the per-Wound/Hull split CD lacks.',
  },
  {
    name: 'Vehicle-upgrade pricing — flat `p_unit × item.size`',
    category: 'points',
    text: 'Single .ods "POINTS" column, flat per-vehicle (no per-Wound/Hull scaling) — same simple ' +
      'shape as GK/Inquisition vehicle equipment. Value now in `p_unit` after the fix.',
  },
  {
    name: 'Trait pricing — 3-column, army-wide, per-unit (`*` = per Wound/Hull)',
    category: 'points',
    text: 'The RICHEST trait-pricing shape migrated: the .ods TRAITS table has NORMAL / CHARACTER ' +
      'MODELS / MONSTROUS CREATURES & VEHICLES columns, with `*` meaning "paid for every Wound or ' +
      'Hull point in the unit" (e.g. Bionic Improvement 1*/0/1*, Born Soldiers 5/0/5, Heavy Infantry ' +
      '3*/0/-). A per-UNIT cost paid army-wide when the trait is taken (all units must be upgraded). ' +
      'CSM/SM traits are flat per-unit; IG adds the character/MC&V split + the per-Wound `*` tier.',
  },
];
