/**
 * Keyword vocabulary — typed constants for the keyword system.
 *
 * GLYPH POLICY (ᵀ collision resolved):
 *   ᵀ means TERMINATOR-compatible wargear (NOT Mark of Tzeentch).
 *   Mark glyphs in item names: ᴷ Khorne · ᴺ Nurgle · ˢ Slaanesh.
 *   Tzeentch is NOT name-glyph-encoded (items live in armory_marks.Tzeentch).
 *   ᶻ is RESERVED for Tzeentch if a name glyph is ever needed — never reuse ᵀ.
 *   When work touches Tzeentch-vs-Terminator, ask the maintainer — do not assume.
 */

/** The four Chaos god marks + Undivided. */
export type ChaosMark = 'Khorne' | 'Nurgle' | 'Slaanesh' | 'Tzeentch' | 'Undivided';
export const CHAOS_MARKS: ChaosMark[] = ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch', 'Undivided'];

/** Sacred numbers for the Favored rule. */
export const SACRED_NUMBERS: Record<Exclude<ChaosMark, 'Undivided'>, number> = {
  Khorne: 8, Nurgle: 7, Slaanesh: 6, Tzeentch: 9,
};

/** Armour keyword values (carried on Unit.armourKeyword and ArmoryItem.armourKeyword). */
export type ArmourKeyword = 'Terminator' | 'Cataphractii' | 'Tartaros' | 'Gravis' | 'Phobos' | 'Master-crafted';

/**
 * Chaos-mark glyph map — trailing superscript on an armory item name encodes the required mark.
 * ᵀ is deliberately ABSENT (Terminator-compat, not a mark).
 * ᶻ is the reserved placeholder for Tzeentch if a name glyph is ever used.
 */
export const MARK_GLYPHS: Record<string, ChaosMark> = {
  'ˢ': 'Slaanesh',
  'ᴷ': 'Khorne',
  'ᴺ': 'Nurgle',
  'ᶻ': 'Tzeentch',
};

/** All mark glyph characters as a set — for fast trailing-char lookup. */
export const MARK_GLYPH_SET = new Set(Object.keys(MARK_GLYPHS));
