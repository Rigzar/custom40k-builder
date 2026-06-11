/**
 * codex_adeptus_sororitas/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/adeptus_sororitas.md` §1. Like IG/AdMech, ALL FOUR axes are EMPTY —
 * Sororitas gate wargear via prose ("Only for X") + boolean flags, never a keyword. THIRD faction
 * (after IG, AdMech) with no armour gate. This catalogue documents the deliberate ABSENCE.
 *
 *   - `armour` — EMPTY. No `armourKeyword` on any of 27 units. Armour is a stat-tier Armory buy
 *     (Plate 4+ / Power 3+ / Master-crafted 2+, "Not combinable with other armors").
 *   - `mark` — EMPTY. No `locked_mark`; Sororitas have NO Marks-of-Chaos archetype (unlike IG's
 *     Traitor Guard / AdMech's Dark Mechanicum).
 *   - `faction` — EMPTY. Acts of Faith gate on the datasheet rule + Faith-point economy, not a
 *     keyword. (Orders Militant are a LEGACY-unlock axis — Order Armory — not a base keyword; §5.)
 *   - `datasheet` — EMPTY. All 27 units keywords[] = []. EIGHTH confirmation datasheet axis is
 *     the CSM-only exception.
 */

export interface SororitasKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/adeptus_sororitas.md §1. ALL axes deliberately empty (see header).
export const SORORITAS_KEYWORDS: SororitasKeywordEntry[] = [
  // --- armour axis: EMPTY — stat-tier Armory purchases, not a keyword gate (3rd after IG/AdMech). ---
  // --- mark axis: EMPTY — no locked_mark, no Marks-of-Chaos archetype. ---
  // --- faction axis: EMPTY — Acts of Faith gate on datasheet rule + Faith economy; Orders Militant
  //     are a Legacy-unlock axis (§5), not a base keyword. ---
  // --- datasheet axis: EMPTY — all 27 units keywords[] = []. ---
];
