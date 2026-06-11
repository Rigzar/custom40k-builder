/**
 * codex_tyranids/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/tyranids.md` §1. Tyranids are the THIRD faction (after CSM and Dark
 * Eldar) with a POPULATED `datasheet` axis — but UNLIKE those two (sub-faction/legion keywords),
 * all 40 units carry the SAME uniform "Tyranid" faction-identity keyword (not a discriminating
 * split). armour/mark axes empty.
 *
 *   - `datasheet` — POPULATED, but uniform: "Tyranid" on all 40 units. A faction-identity keyword
 *     (gates "Tyranid only" / faction-wide references), not an in-faction split.
 *   - `armour` — EMPTY. Defence is biology (carapace saves + Hardened Carapace biomorph), not a
 *     keyword. No ᵀ-gate.
 *   - `mark` — EMPTY. No `locked_mark`. (Hive Fleets are a Legacy axis, not a base keyword.)
 *   - `faction` — covered by the uniform "Tyranid" datasheet keyword above.
 */

export interface TyranidKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/tyranids.md §1 (uniform "Tyranid" keyword from production keywords[]).
export const TYRANID_KEYWORDS: TyranidKeywordEntry[] = [
  // --- datasheet axis: POPULATED but uniform — every unit is "Tyranid" ---
  {
    keyword: 'Tyranid',
    axis: 'datasheet',
    gates: 'Uniform faction-identity keyword carried by ALL 40 units (`keywords: ["Tyranid"]`). ' +
      'Gates faction-wide / "Tyranid only" references; does NOT split the roster into sub-factions ' +
      '(unlike Dark Eldar\'s Kabal/Coven/Cult). 3rd faction after CSM + Dark Eldar with a non-empty ' +
      'datasheet axis, but the first whose axis is uniform rather than discriminating.',
  },

  // --- armour axis: EMPTY — biology, not a keyword gate; no ᵀ-gate. ---
  // --- mark axis: EMPTY — no locked_mark. Hive Fleets are a Legacy axis (§5). ---
];
