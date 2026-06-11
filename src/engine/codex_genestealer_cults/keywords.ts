/**
 * codex_genestealer_cults/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/genestealer_cults.md` §1. ALL FOUR axes EMPTY — the IG/AdMech/
 * Sororitas/Eldar/Harlequins group. GSC gate wargear via prose + boolean flags, never a keyword.
 *
 *   - `armour` — EMPTY. No `armourKeyword`; defence via invuln items, not a keyword gate; no ᵀ-gate.
 *   - `mark` — EMPTY. No `locked_mark`.
 *   - `faction` — EMPTY. Ambush is an army-wide datasheet/deployment rule.
 *   - `datasheet` — EMPTY. All 20 units keywords[] = [].
 */

export interface GscKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/genestealer_cults.md §1. ALL axes deliberately empty (see header).
export const GSC_KEYWORDS: GscKeywordEntry[] = [
  // --- armour axis: EMPTY — defence via invuln items, not a keyword gate. ---
  // --- mark axis: EMPTY — no locked_mark. ---
  // --- faction axis: EMPTY — Ambush is an army-wide deployment rule. ---
  // --- datasheet axis: EMPTY — all 20 units keywords[] = []. ---
];
