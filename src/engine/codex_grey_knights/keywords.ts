/**
 * codex_grey_knights/keywords — category 3 of 5 in the codex.ts data model (Keyword).
 *
 * Catalogue of Grey Knights' keyword vocabulary, migrated from `rules-model/grey_knights.md` §1.
 *
 * SIMPLEST keyword shape catalogued so far: only the `armour` axis is populated, with a single
 * binary ᵀ-gate (Terminator) — the SAME shape as Inquisition's armour axis (a single gate, no
 * Cataphractii/Gravis sub-split the way SM has — see [[project_inquisition_codex_migration]]),
 * a THIRD faction landing on this shape. Unlike Inquisition, GK has NO `ordo`-equivalent axis:
 * the "Demon Hunters" allied-access rule (§4) is a textual army-wide Special Rule, not a
 * per-unit identity keyword, so it lives in special-abilities.ts (Step 4), not here.
 *
 *   - `armour` — POPULATED (2 entries): Power armour (baseline) + Terminator (single ᵀ-gate,
 *     7/22 units, `armourKeyword: "Terminator"`). NO Cataphractii/Gravis analogue — digest §1
 *     "No Cataphractii/Gravis-as-keyword analogue exists" (verbatim).
 *   - `mark` — EMPTY. Digest §1 verbatim: "Sub-factions / Marks: NONE." GK is a single unified
 *     Chapter — no Mark-equivalent axis at all (a cleaner absence than Inquisition's, which has
 *     a *functional* equivalent — Ordo — modelled via a different primitive; GK has none).
 *   - `faction` — EMPTY. The "Demon Hunters" allied-access rule and "Brotherhood of Psykers"/
 *     "Faithful" grants are all textual datasheet-level abilities (digest §4), not derived from
 *     a blanket per-unit identity keyword.
 *   - `datasheet` — EMPTY. Digest §1: grepped all 22 units' `keywords[]` → 22/22 empty. FIFTH
 *     confirmation (CSM=6, CD/SM/Inquisition/now GK=0) that a populated datasheet axis is the
 *     per-faction EXCEPTION, not the rule.
 */

export interface GkKeywordEntry {
  /** Keyword as it appears in canonical text, e.g. "Terminator armor" */
  keyword: string;
  /** Which axis this keyword belongs to */
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  /** What this keyword gates / grants (verbatim rule reference) */
  gates?: string;
}

// Source: rules-model/grey_knights.md §1 (vocabulary) + §2 (wargear gating table).
export const GK_KEYWORDS: GkKeywordEntry[] = [
  // --- armour axis (2 entries; Terminator = standard ᵀ-gate, engine-derived) ---
  {
    keyword: 'Power armor',
    axis: 'armour',
    gates: 'The faction\'s baseline armour for non-Terminator units — no special equipment-' +
      'subset gate of its own, structurally analogous to Inquisition\'s "Power armor" baseline ' +
      'entry.',
  },
  {
    keyword: 'Terminator',
    axis: 'armour',
    gates: 'Single binary ᵀ-gate (`armourKeyword: "Terminator"`, 7/22 units: Ancient/Apothecary/' +
      'Captain/Ghost Terminator Squad/Librarian/Paladin Squad/Terminator Squad). Restricts the ' +
      '60-of-65 ᵀ-glyph armory items (`armour_compat: ["Terminator"]`) to these units, via the ' +
      'shared cross-faction `modelRestrictsToTermSubset`/`filterTermCompat` primitives (same ' +
      'mechanism CSM/SM/CD/Inquisition all use, documented not re-derived). NO Cataphractii/' +
      'Gravis sub-split — digest §1 explicit absence, same shape as Inquisition\'s armour axis ' +
      '(a THIRD faction confirming "single ᵀ-gate, no ᴳ split" is its own recurring shape, ' +
      'distinct from SM\'s fully-populated 6-entry armour spread).',
  },

  // --- mark axis: EMPTY — digest §1 verbatim "Sub-factions / Marks: NONE." GK is a single
  //     unified Chapter; no functional equivalent exists either (unlike Inquisition's Ordo) ---

  // --- faction axis: EMPTY — "Demon Hunters"/"Brotherhood of Psykers"/"Faithful" are textual
  //     datasheet-level Special Rules (digest §4), not derived from a per-unit identity keyword;
  //     modelled in special-abilities.ts (Step 4) instead ---

  // --- datasheet axis: EMPTY — grepped all 22 units' keywords[] = []. FIFTH confirmation
  //     (CSM=6, CD=0, SM=0, Inquisition=0, GK=0) that a populated datasheet axis is the exception ---
];
