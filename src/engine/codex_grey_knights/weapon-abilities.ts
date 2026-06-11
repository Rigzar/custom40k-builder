/**
 * codex_grey_knights/weapon-abilities — category 5 of 5 (FINAL) in the codex.ts data model
 * (Weapon ability).
 *
 * Catalogue of Grey Knights' WARGEAR-LEVEL GATE MECHANICS — the structural rules deciding which
 * armory items a model can take and how they're priced/derived. NOT the named weapon abilities
 * themselves (Force weapon/Shield breaker/etc. already canonical in coreRules.ts glossary).
 * Migrated from `rules-model/grey_knights.md` §2 (wargear gating) + §3 (points model).
 *
 * Completing this file closes Fase 4 for Grey Knights — 5/5 categories (Slot/Unit type/
 * Keyword/Special ability/Weapon ability), mirroring codex_csm/CD/SM/Inquisition exactly —
 * FIFTH faction fully migrated to the 5-category model.
 *
 * Anti-duplication discipline held: documents the GATE MECHANICS, not the gated content — the
 * ᵀ-armour keyword grant lives in GK_KEYWORDS (`armour` axis), the Demon Hunters/Faithful/Psyker
 * grants live in GK_SPECIAL_ABILITIES, named weapon abilities live in coreRules.ts.
 */

export interface GkWeaponAbilityEntry {
  /** Mechanic name as documented in the digest, e.g. "ᵀ-glyph gating" */
  name: string;
  /** One of: gating mechanic / points-model rule / structural note */
  category: 'gating' | 'points' | 'structural';
  /** Verbatim or close-paraphrase mechanic text + grounding reference */
  text: string;
}

// Source: rules-model/grey_knights.md §2 (wargear gating table) + §3 (points model) + §6.3.
export const GK_WEAPON_ABILITIES: GkWeaponAbilityEntry[] = [
  // --- §2 gating mechanics ---
  {
    name: 'ᵀ-glyph gating (Terminator armour subset)',
    category: 'gating',
    text: 'Standard Terminator gate — 60 of 65 armory entries carry `armour_compat: ' +
      '["Terminator"]`, restricted to the 7 units with `armourKeyword: "Terminator"` (GK_KEYWORDS' +
      ' `armour` axis). Engine-derived via the shared `isTerminatorArmourName`/' +
      '`modelRestrictsToTermSubset` mechanism (same primitive CSM/SM/CD/Inquisition all share). A ' +
      'single binary gate, no Cataphractii/Gravis split (matches Inquisition\'s shape — a THIRD ' +
      'faction confirming this).',
  },
  {
    name: 'Non-ᵀ universal items (5)',
    category: 'gating',
    text: 'Bound blade / Cleansing flame / Hunter-killer missile / Master-crafted armor / Warden ' +
      'of the Blade / Radiant Champion — no armour-keyword gate, universally available subject ' +
      'to per-item "Only for X" prose restrictions below.',
  },
  {
    name: '"Only for X" prose restrictions',
    category: 'gating',
    text: '"Only for Captains" (Titansword), "Only for Librarians" (Familiar/Librum Arcana), ' +
      '"Only for Apothecaries" (Selfless healer), "Only for Ancients" (Brotherhood banner), "Only ' +
      'for Brotherhood-Champion" (Radiant Champion/Warden of the Blade), "Only for infantry" ' +
      '(Personal teleporter) — prose-only unit-restrictions, NOT keyword-derived. Mirrors CSM/SM/' +
      'Inquisition\'s "Only for X" pattern (engine enforces via free-text match, not a keyword ' +
      'axis).',
  },
  {
    name: 'Veteran Abilities (8) — `category: \'veteran\'` gate',
    category: 'gating',
    text: 'Counter-attack / Favoured enemy / Furious charge / Infiltrator / Outflank / Tank ' +
      'hunter / Terrain expert / Vanguard — gated by `category: \'veteran\'` + unit `has_' +
      'veteran_abilities` (15/22 units). FIXED this session (`ki-gk-vetvehcategory-01`): all 8 ' +
      'now carry `category: \'veteran\'`; Infiltrator/Vanguard have `p_veh: null` (no vehicle/' +
      'monster application, matching the HTML\'s "-" in the M&V column), the other 6 have ' +
      '`p_veh: 2`.',
  },
  {
    name: 'Vehicle Equipment (10) — `category: \'vehicle\'` gate',
    category: 'gating',
    text: 'Additional armor / Blessed / Hunter-killer missile / Improved targeting / Jammer / ' +
      'Machine spirit / Ordained hull / Psy-ammunition / Smoke Launcher / Truesilver armor — ' +
      'gated by `category: \'vehicle\'` + unit `is_vehicle` (7/22 units). FIXED this session (' +
      '`ki-gk-vetvehcategory-01`): all 10 now carry `category: \'vehicle\'`. Flat `p_unit × ' +
      'item.size` pricing — see points-model entry below. GK has 5 MORE vehicle-equipment items ' +
      'than Inquisition (10 vs 5).',
  },

  // --- §3 points model ---
  {
    name: 'Standard equipment pricing (`p_unit`/`p_char`)',
    category: 'points',
    text: 'Mirrors CSM/SM/Inquisition `getItemPts` semantics exactly — flat `p_unit` per model, ' +
      '`p_char` as a flat character override (falls back to `p_unit` when null). No `× item.size` ' +
      'multiplier for regular equipment.',
  },
  {
    name: 'Veteran-ability pricing — per-model / per-Wound-or-Hull-point split',
    category: 'points',
    text: 'GK\'s Armory.html veteran-abilities table has TWO price columns: "POINTS" (= ' +
      '`p_unit`) and "POINTS MONSTROUS CREATURES & VEHICLES" (= `p_veh`). For ' +
      '`category: \'veteran\'` items: infantry/characters pay per-model (`p_unit × item.size`, ' +
      'falling back from `p_char` which is `null` for all 8 GK veteran items — GK\'s HTML has no ' +
      'separate character-price column, unlike Inquisition\'s `p_char: 2`); vehicles/monsters pay ' +
      'per-Wound-or-Hull-point (`p_veh × woundCount × item.size`). 6 of the 8 items have ' +
      '`p_veh: 2`; Infiltrator/Vanguard have `p_veh: null` (no vehicle/monster application). This ' +
      'is the SAME richer per-unit-vs-per-Wound/Hull-point split [[project_space_marines_codex_' +
      'migration]] found CD lacks entirely — GK sits on the SM/Inquisition side of that inverse-' +
      'pair, a THIRD faction confirming the split is real game design.',
  },
  {
    name: 'Vehicle-equipment pricing — flat `× item.size`',
    category: 'points',
    text: 'For `category: \'vehicle\'` items (the 10-item Vehicle Equipment list): flat ' +
      '`p_unit × item.size`, no per-Wound/Hull-point scaling (that scaling is reserved for the ' +
      '`veteran` category above) — the same single-tier shape as Inquisition\'s 5-item Vehicle ' +
      'Equipment list.',
  },

  // --- §6.3 structural note ---
  {
    name: '`armour_compat: string[]` already keyword-array shaped',
    category: 'structural',
    text: 'GK\'s production armory ALREADY uses the target keyword-ARRAY shape ' +
      '(`"armour_compat": ["Terminator"]`) rather than the older `term_compat: true/false` ' +
      'boolean flag CSM/SM/CD/Inquisition\'s pre-migration data used. GOOD NEWS for the ' +
      '"Modelo de datos objetivo: KEYWORDS" refactor (2026-06-03 decision) — GK\'s armory data is ' +
      'structurally AHEAD of the four already-migrated factions on this specific axis. Worth ' +
      'checking whether `keywords.ts`\'s shared `isTerminatorArmourName`/' +
      '`modelRestrictsToTermSubset` primitives already handle the array shape or need a small ' +
      'adapter, when the cross-faction keyword-engine refactor is undertaken.',
  },
];
