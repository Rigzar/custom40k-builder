/**
 * codex_orks/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/orks.md` §1. UNLIKE the IG/AdMech/Sororitas/Aeldari/GSC empty-armour
 * group, Orks have a POPULATED `armour` axis: Mega armor (the Ork heavy-armour gate). Mark/faction/
 * datasheet axes empty.
 *
 *   - `armour` — POPULATED (1 entry): Mega armor. The `.ods` Armory states "Models in Mega armor can
 *     only receive equipment with ᵀ"; production encodes this via the ᴹ glyph suffixed to 32/62
 *     armory item names. CAVEAT: the gate is keyed via the ᴹ name-glyph, NOT an `armourKeyword`
 *     field NOR `term_compat` (both absent) — a glyph-encoded armour axis (same family as CSM mark-
 *     glyphs; see weapon-abilities.ts §structural). Mega armor is itself a purchasable item.
 *   - `mark` — EMPTY. No `locked_mark`. (`<Klan>` is the Legacy/Clan axis, §5, not a base keyword.)
 *   - `faction` — EMPTY. Waaagh!/Mob/Dakka/Tellyporta are army-wide datasheet rules. The `<Squig>`/
 *     `<Wildork>` keywords are GRANTED by armory options (Squighog steed / Wildork), not base unit
 *     keywords.
 *   - `datasheet` — EMPTY. All 41 units `keywords[]` = [].
 */

export interface OrkKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/orks.md §1.
export const ORK_KEYWORDS: OrkKeywordEntry[] = [
  // --- armour axis (1 entry; Mega armor, ᴹ glyph-encoded) ---
  {
    keyword: 'Mega armor',
    axis: 'armour',
    gates: 'The Ork heavy-armour gate. ".ods: Models in Mega armor can only receive equipment with ' +
      'ᵀ" — production encodes the restriction via the ᴹ glyph suffixed to 32/62 armory item names ' +
      '(e.g. "Ammo grotᴹ", "Boss poleᴹ"). Mega armor is a purchasable item (22/42 pts) granting the ' +
      'ᴹ-armoured status. CAVEAT: glyph-encoded (ᴹ in the name), NOT an `armourKeyword` field nor ' +
      '`term_compat` — the same pre-keyword-seam family as CSM mark-glyphs.',
  },

  // --- mark axis: EMPTY — no locked_mark. <Klan> is the Legacy/Clan axis (§5). ---
  // --- faction axis: EMPTY — Waaagh!/Mob/Dakka/Tellyporta are army-wide rules; <Squig>/<Wildork>
  //     are armory-granted, not base keywords. ---
  // --- datasheet axis: EMPTY — all 41 units keywords[] = []. ---
];
