/**
 * codex_leagues_of_votann/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/leagues_of_votann.md` §1. Like Orks/Custodes/CSM, Votann have a
 * POPULATED `armour` axis: Exo-armor (the Votann heavy-armour gate). Mark/faction/datasheet axes
 * empty.
 *
 *   - `armour` — POPULATED (1 entry): Exo-armor. The `.ods` Armory states "Models in Exo-armor can
 *     only receive equipment marked with ᵀ"; production encodes this via the ᴱ glyph suffixed to
 *     14/27 armory item names. CAVEAT: glyph-encoded (ᴱ in the name), NOT an `armourKeyword` field
 *     nor `term_compat` (both absent) — same family as Orks Mega-armor ᴹ-glyph (see
 *     weapon-abilities.ts §structural). Exo-armor is itself a purchasable item (infantry only).
 *   - `mark` — EMPTY. No `locked_mark`. (Leagues are the Legacy axis, §5, not a base keyword.)
 *   - `faction` — EMPTY. Eye of the Ancestors / Steady Advance / Void armor are army-wide rules.
 *   - `datasheet` — EMPTY. All 18 units `keywords[]` = [].
 */

export interface VotannKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/leagues_of_votann.md §1.
export const VOTANN_KEYWORDS: VotannKeywordEntry[] = [
  // --- armour axis (1 entry; Exo-armor, ᴱ glyph-encoded) ---
  {
    keyword: 'Exo-armor',
    axis: 'armour',
    gates: 'The Votann heavy-armour gate. ".ods: Models in Exo-armor can only receive equipment ' +
      'marked with ᵀ" — production encodes the restriction via the ᴱ glyph suffixed to 14/27 armory ' +
      'item names (e.g. "Ancestor relicᴱ", "RAM shieldᴱ"); plus a "Weavefield crest (Exo)" variant ' +
      '"Exo-armor only". Exo-armor is a purchasable item (2+ Sv / 5+inv / Massive/Shock Troops/' +
      'Unyielding, infantry only). CAVEAT: glyph-encoded (ᴱ), NOT an `armourKeyword` field nor ' +
      '`term_compat` — same pre-keyword-seam family as Orks Mega-armor ᴹ-glyph.',
  },

  // --- mark axis: EMPTY — no locked_mark. Leagues are the Legacy axis (§5). ---
  // --- faction axis: EMPTY — Eye of the Ancestors / Steady Advance / Void armor are army-wide rules. ---
  // --- datasheet axis: EMPTY — all 18 units keywords[] = []. ---
];
