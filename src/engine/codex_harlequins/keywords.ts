/**
 * codex_harlequins/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/harlequins.md` §1. ALL FOUR axes EMPTY — the IG/AdMech/Sororitas/Eldar
 * group (simplest keyword vocabulary, alongside Inquisition). Harlequins gate wargear via prose +
 * boolean flags, never a keyword.
 *
 *   - `armour` — EMPTY. No `armourKeyword`; no ᵀ-gate.
 *   - `mark` — EMPTY. No `locked_mark`.
 *   - `faction` — EMPTY. Shuriken / Webway strike are army-wide datasheet rules.
 *   - `datasheet` — EMPTY. All 9 units keywords[] = [].
 */

export interface HarlequinsKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/harlequins.md §1. ALL axes deliberately empty (see header).
export const HARLEQUINS_KEYWORDS: HarlequinsKeywordEntry[] = [
  // --- armour axis: EMPTY — no armourKeyword / no ᵀ-gate. ---
  // --- mark axis: EMPTY — no locked_mark. ---
  // --- faction axis: EMPTY — Shuriken / Webway strike are army-wide rules. ---
  // --- datasheet axis: EMPTY — all 9 units keywords[] = []. ---
];
