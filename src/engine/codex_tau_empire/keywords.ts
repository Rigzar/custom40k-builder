/**
 * codex_tau_empire/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/tau_empire.md` §1. T'au gate wargear via the ᴵ (Infantry) glyph + the
 * Kroot sub-type embedded in `unit_type`. `keywords[]` itself is EMPTY on all 42 units, so the
 * datasheet axis is documented here as the structural notes the gating actually rides on.
 *
 *   - `armour` — Infantry-restriction axis (ᴵ glyph). The `.ods` "Infantry may only use ᵀ-marked
 *     equipment" rule is encoded via the ᴵ glyph suffixed to Infantry-usable item names. CAVEAT:
 *     glyph-encoded (ᴵ), NOT an `armourKeyword`/`term_compat` field — same family as Orks ᴹ /
 *     Votann ᴱ.
 *   - `mark` — EMPTY. No `locked_mark`. (Septs are the Legacy axis, §5.)
 *   - `faction` — Kroot sub-faction lives in `unit_type` ("..., Kroot"), NOT in `keywords[]`. The
 *     Kroot Hunting Pack archetype gates on it. A different encoding from Dark Eldar's keywords[]
 *     sub-factions (candidate to promote into keywords[] in a future keyword-engine refactor).
 *   - `datasheet` — EMPTY. All 42 units `keywords[]` = [].
 */

export interface TauKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/tau_empire.md §1.
export const TAU_KEYWORDS: TauKeywordEntry[] = [
  // --- armour axis: Infantry-restriction via the ᴵ glyph ---
  {
    keyword: 'Infantry (ᴵ glyph)',
    axis: 'armour',
    gates: '".ods: Infantry models may only use equipment marked with ᵀ" (general equipment + ' +
      'Support Systems, single-pick). Production encodes this via the ᴵ glyph suffixed to Infantry-' +
      'usable item names (e.g. "Repulsor impact fieldᴵ", "Shield generatorᴵ"). Glyph-encoded (ᴵ), ' +
      'NOT an `armourKeyword`/`term_compat` field — same pre-keyword-seam family as Orks ᴹ / Votann ' +
      'ᴱ.',
  },
  {
    keyword: 'Kroot',
    axis: 'faction',
    gates: 'Sub-faction, but encoded in `unit_type` ("..., Kroot" on ~9 units), NOT in `keywords[]`. ' +
      'The Kroot Hunting Pack archetype gates on it (Kroot-only minimums + 25% Troops). A different ' +
      'encoding from Dark Eldar\'s keywords[] sub-factions — candidate to promote into keywords[] in ' +
      'a future keyword-engine refactor.',
  },

  // --- mark axis: EMPTY — no locked_mark. Septs are the Legacy axis (§5). ---
  // --- datasheet axis: EMPTY — all 42 units keywords[] = [] (Kroot lives in unit_type). ---
];
