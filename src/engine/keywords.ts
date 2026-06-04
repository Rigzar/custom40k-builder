import type { ArmoryItem, Unit } from '../types/data';

/**
 * Keyword-derivation seam for wargear gating.
 *
 * The target data model gates armory wargear on KEYWORDS (armour class, Chaos Mark, unit type),
 * not on pre-baked per-item flags. This module is the single place that derives those gates. Today
 * it derives them from the existing encoding (the ᵀ/mark glyph on the item name, the `term_compat`
 * flag, the unit's armour ability); a later data migration (Phase 3) can swap the *internals* to read
 * explicit `keywords[]` arrays without touching any consumer. See rules-model/_engine.md §10 and
 * project-pipeline-migration.
 */

/**
 * Chaos Mark glyph → Mark name. A trailing superscript on an armory item name encodes the Chaos
 * Mark the item requires.
 *
 * ᵀ COLLISION — RESOLVED (verb-grounded, verified in data): in this homebrew the ᵀ superscript means
 * TERMINATOR-compatible wargear, NOT Mark of Tzeentch. ᵀ is captured as the `term_compat` flag at
 * parse time and never left on a name (verified: ZERO armory item names end in ᵀ across all
 * factions). The other three marks DO appear as name glyphs — ᴷ Khorne, ᴺ Nurgle, ˢ Slaanesh (e.g.
 * "Blood throneᴷ", "Seeker of Slaaneshˢ"). Mark of Tzeentch is NOT name-glyph-encoded: its items
 * live in the dedicated `armory_marks.Tzeentch` section. So ᵀ is intentionally OMITTED from this map
 * — a Terminator-ᵀ name can never be misread as Tzeentch. A distinct placeholder glyph (ᶻ) is
 * reserved for Tzeentch should a datasheet ever need one; DO NOT reuse ᵀ. Whenever Custom40k work
 * touches the Tzeentch-vs-Terminator distinction, ASK THE USER rather than assume.
 * (See rules-model/chaos_space_marines.md.)
 */
export const MARK_GLYPHS: Record<string, string> = {
  'ˢ': 'Slaanesh', 'ᴷ': 'Khorne', 'ᴺ': 'Nurgle', 'ᶻ': 'Tzeentch',
};

/** The Chaos Mark this item requires (derived from its trailing glyph), or null if unrestricted. */
export function itemRequiredMark(name: string): string | null {
  return MARK_GLYPHS[name.slice(-1)] ?? null;
}

/** Item name with any trailing Chaos-Mark glyph stripped (for display). Keep in sync with
 *  MARK_GLYPHS — ᵀ is deliberately NOT here (it is Terminator-compat, not a mark). */
export function stripMarkGlyph(name: string): string {
  return name.replace(/[ˢᴷᴺᶻ]$/, '');
}

/** Names that denote a Terminator-class armour profile (Terminator / Cataphractii / Tartaros). */
const TERM_ARMOUR_RE = /terminator|cataphractii|tartaros/i;
export function isTerminatorArmourName(name: string): boolean {
  return TERM_ARMOUR_RE.test(name);
}

/**
 * Does this model restrict its armory picks to the ᵀ (Terminator-compatible) subset?
 *
 * Rules (grounded, CSM Armory.html): "Models wearing Cataphractii or Terminator armor can only
 * receive equipment with ᵀ." Both armour keywords gate identically to the ᵀ subset — they differ
 * only in the invulnerable save (Cataphractii 4+ / Terminator 5+), not in what wargear they allow.
 *
 * The restriction fires when the model carries a Terminator-class armour keyword, whether
 * INNATE (the datasheet bakes it in — `unit.armourKeyword`) or DYNAMICALLY BOUGHT (the model has
 * purchased a `Terminator armor` / `Cataphractii armor` equipment item — passed in
 * `boughtArmourNames`). The legacy ability-string fallback ("Cataphractii armor …") is kept for
 * any unit not yet carrying an explicit `armourKeyword`.
 */
export function modelRestrictsToTermSubset(unit: Unit, boughtArmourNames: string[] = []): boolean {
  if (unit.armourKeyword && isTerminatorArmourName(unit.armourKeyword)) return true;
  if (boughtArmourNames.some(n => isTerminatorArmourName(n))) return true;
  return (unit.abilities ?? []).some(a => a.toLowerCase().startsWith('cataphractii armor'));
}

/** Names that denote a Gravis armour profile. */
const GRAVIS_ARMOUR_RE = /gravis/i;
export function isGravisArmourName(name: string): boolean {
  return GRAVIS_ARMOUR_RE.test(name);
}

/**
 * Does this model restrict its armory picks to the ᴳ (Gravis-compatible) subset?
 *
 * Rules (grounded, SM Armory.html L69): "Models wearing Gravis armor can only receive equipment
 * with ᴳ." Mirrors the ᵀ/Terminator gate exactly. Fires when the model carries Gravis armour,
 * whether INNATE (datasheet — `unit.armourKeyword` "Gravis", or the baked "Gravis armor" ability)
 * or DYNAMICALLY BOUGHT (a purchased `Gravis armor` equipment item, in `boughtArmourNames`). Gravis
 * and Terminator are mutually exclusive ("not combinable"), so at most one subset gate applies.
 */
export function modelRestrictsToGravisSubset(unit: Unit, boughtArmourNames: string[] = []): boolean {
  if (unit.armourKeyword && isGravisArmourName(unit.armourKeyword)) return true;
  if (boughtArmourNames.some(n => isGravisArmourName(n))) return true;
  return (unit.abilities ?? []).some(a => a.toLowerCase().startsWith('gravis armor'));
}

export interface MarkGateCtx {
  /**
   * When true the armory source carries no Chaos Marks, so a trailing ᵀ must NOT be read as Mark of
   * Tzeentch (e.g. the Horus Heresy supplement, where ᵀ means Terminator-compatible). See
   * ki-hh-tcollision-01.
   */
  markless?: boolean;
  /** The model's effective Chaos Mark (locked / archetype-forced / chosen). */
  effectiveMark?: string | null;
}

/** True when the item requires a Chaos Mark the model doesn't carry (so it cannot be bought). */
export function isItemMarkBlocked(arm: ArmoryItem, ctx: MarkGateCtx): boolean {
  if (ctx.markless) return false;
  const req = itemRequiredMark(arm.name);
  if (!req) return false;
  return req !== (ctx.effectiveMark ?? null);
}
