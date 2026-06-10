/**
 * codex_space_marines/keywords — category 3 of 5 in the codex.ts data model (Keyword).
 *
 * Catalogue of SM's keyword vocabulary, migrated from `rules-model/space_marines.md` §1-§2
 * (VALIDATED — digest re-read against Armory.html/Index.html 2026-06-04, gating mechanism
 * shipped+verified v0.51).
 *
 * Genuinely the INVERSE distribution of CD's axes (CD: 2 populated/2 empty; SM: 1 populated/
 * 3 empty) — a real architectural finding, not a coincidence of two similar templates:
 *   - `armour` — POPULATED (6 entries). SM's richest axis: Gravis/Terminator/Cataphractii/
 *     Master-crafted/Phobos/Power armour, all gating equipment by superscript glyph (ᴳ/ᵀ),
 *     mechanism shipped v0.51 (`modelRestrictsToGravisSubset`/`TermSubset` — documented not
 *     re-derived here).
 *   - `mark` — EMPTY BY DESIGN. Digest §1 verbatim: "NONE. SM has no marks (`armory_marks`
 *     empty). Chapter identity is expressed via Legacy (chapter armory + discipline), not a
 *     per-model keyword." The structural slot CSM/CD both use for god-allegiance simply does
 *     not exist in SM's rules — chapters are an army-level Legacy selection, never a per-unit
 *     gating keyword (see `datasheet` below for the parallel confirmation).
 *   - `faction` — EMPTY BY DESIGN. Unlike CD's "Daemon" (a real per-unit grant-gate keyword),
 *     SM has no blanket per-unit identity keyword that gates anything: "They Shall Know No
 *     Fear" is documented in the digest (§4) as an ARMY-WIDE rule applied directly from
 *     Index.html, not derived from a "Space Marine" keyword on each datasheet — grepped the
 *     full armory + digest for any such gating keyword, found none (only the literal item name
 *     "Space Marine bike", not a gate). Confirmed absence, not an oversight.
 *   - `datasheet` — EMPTY. Grepped all 74 units' `keywords[]` (production data): every single
 *     one is `[]` — exactly mirrors the CD finding. This is the THIRD confirmation (CSM has
 *     6 legion-identity keywords; CD and SM both have zero) that a populated datasheet axis is
 *     the EXCEPTION, not the rule — most factions carry chapter/legion identity through Legacy
 *     selection, only CSM bakes it into per-unit keywords (Cultist/Death Guard/etc., digest
 *     §4d-4i "Keyword | Locked mark" columns — a CSM-specific design, not a cross-faction norm).
 *
 * Net: SM's keyword model is almost entirely carried by a single rich axis (armour) plus the
 * Legacy/chapter system documented in SM_SPECIAL_ABILITIES — genuinely simpler than CSM's,
 * confirming the digest's "fewer distinct primitives" pattern already seen in CD.
 */

export interface SmKeywordEntry {
  /** Keyword as it appears in canonical text, e.g. "Gravis armor", "Terminator" */
  keyword: string;
  /** Which axis this keyword belongs to (mark/faction/datasheet deliberately empty — see header) */
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  /** What this keyword gates / grants (verbatim rule reference) */
  gates?: string;
}

// Source: rules-model/space_marines.md §1 (vocabulary) + §2 (wargear gating — Armory.html
// L69-70 verbatim glyph rules). VALIDATED 2026-06-04, gating mechanism shipped v0.51.
export const SM_KEYWORDS: SmKeywordEntry[] = [
  // --- armour axis: SM's richest axis (6 entries, all "not combinable with other armors") ---
  {
    keyword: 'Gravis armor',
    axis: 'armour',
    gates: '"Models wearing Gravis armor can only receive equipment with ᴳ" (Armory.html L69 ' +
      'verbatim). Grants +1T, 6+ inv, Massive(1), Unyielding. Native on 4 datasheets (carry ' +
      '`armourKeyword: "Gravis"`): Heavy Intercessor Squad, Aggressor Squad, Inceptor Squad, ' +
      'Eradicator Squad — also buyable as an item. Mutually exclusive with Terminator (at most ' +
      'one subset-gate applies per model). Mechanism: `modelRestrictsToGravisSubset` → ' +
      '`filterGravisCompat`, ki-sm-gravisgate-01 fixed v0.51, 53 ᴳ-tagged items feed the subset.',
  },
  {
    keyword: 'Terminator armor',
    axis: 'armour',
    gates: '"Models wearing Terminator or Cataphractii armor can only receive equipment with ᵀ" ' +
      '(Armory.html L69-70 verbatim). Grants +1T/+1A, 2+ Sv, 5+ inv, Massive(1), Deep Strike, ' +
      'Unyielding — "Only for infantry. Not combinable." Native on 2 datasheets (carry ' +
      '`armourKeyword: "Terminator"`): Terminator Squad, Deathwing Knights — also buyable as ' +
      'item #100 in the general armory and on Captain/Chaplain/Librarian variants. Mechanism: ' +
      '`modelRestrictsToTermSubset` → `filterTermCompat` (shared cross-faction primitive).',
  },
  {
    keyword: 'Cataphractii armor',
    axis: 'armour',
    gates: 'Treated identically to Terminator for gating purposes (ᵀ subset) — "HH supplement ' +
      'mainly" per digest §1; appears in SM\'s own vocabulary as the structural sibling that ' +
      'shares the Terminator-compat bucket, not as a separate gate mechanism.',
  },
  {
    keyword: 'Master-crafted armor',
    axis: 'armour',
    gates: '2+ Sv, no special ᴳ/ᵀ glyph access — "not combinable with other armors". A pure ' +
      'stat-upgrade armour choice, structurally in the same "pick one armour" pool as Power ' +
      'armour/Phobos/Gravis/Terminator but without unlocking a restricted equipment subset.',
  },
  {
    keyword: 'Phobos armor',
    axis: 'armour',
    gates: 'Grants Move Through Cover + Infiltrator — "not combinable with other armors". Same ' +
      'pool as Master-crafted: a stat/ability-upgrade choice, no equipment-subset gate of its own.',
  },
  {
    keyword: 'Power armour',
    axis: 'armour',
    gates: 'The DEFAULT (no keyword/no purchase needed). Items with NO glyph require Power-armour ' +
      'models and explicitly EXCLUDE Gravis/Terminator wearers (Armory.html table) — i.e. the ' +
      'baseline equipment pool is itself gated away from the two restricted-subset armours, the ' +
      'mirror image of the ᴳ/ᵀ exclusivity. Documented as its own entry because it actively ' +
      'excludes, not because it grants anything beyond the baseline profile.',
  },

  // --- mark axis: EMPTY BY DESIGN (digest §1 verbatim "NONE. SM has no marks") ---

  // --- faction axis: EMPTY BY DESIGN (no per-unit "Space Marine" gating keyword exists —
  //     "They Shall Know No Fear" is an army-wide rule applied directly, not keyword-derived) ---

  // --- datasheet axis: EMPTY (grepped — all 74 units' keywords[] = [], chapters are Legacy-only) ---
];
