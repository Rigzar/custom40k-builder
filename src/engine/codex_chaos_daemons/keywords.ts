/**
 * codex_chaos_daemons/keywords — category 3 of 5 in the codex.ts data model (Keyword).
 *
 * Catalogue of CD's keyword vocabulary, migrated from `rules-model/chaos_daemons.md` §1 + §4b
 * (VALIDATED — digest itself confirms re-read against Index.html / Army Customisation 2026-06-03).
 *
 * Three axes populated, ONE deliberately empty:
 *   - `armour` — EMPTY BY DESIGN. Digest §1 verbatim: "There is no armour-type axis (no
 *     Terminator/Cataphractii/Gravis — those are CSM/SM concepts and do not appear in CD)".
 *     Confirmed cross-faction in `engine/keywords.ts` §7 discrepancy-log: CD armory items are
 *     always `term_compat: false` — "that's correct data, not noise" (✅ by design, do not add).
 *   - `mark` — the 4 Chaos gods (NO Undivided in CD, unlike CSM — digest §1 line 31). Verbatim
 *     veteran-ability grants from §4b, sacred numbers (Favored Units), Animosity rivalries
 *     (identical structure + rival pairs to CSM, shared `validators.ts allowedMarks()`).
 *   - `faction` — "Daemon" / "Greater Daemon", the army-wide identity keyword (§1 line 37-39):
 *     grants invulnerable saves + Daemonic Instability (Core Rules special-rules block) and is
 *     also the pricing-tier / Entourage-Herald-stacking keyword.
 *   - `datasheet` — EMPTY. Grepped all 37 units' `keywords[]` (production data): every single
 *     one is `[]`. Unlike CSM (which has 6 legion/warband-identity keywords — Cultist/Death
 *     Guard/World Eaters/etc.), CD datasheets carry no per-unit identity keyword beyond their
 *     `locked_mark` + the blanket "Daemon" — confirmed empty by design, not a data gap.
 *
 * God superscripts (ᴷ/ᴺ/ˢ/ᵀ) gate armory items by matching Mark — same `itemRequiredMark`/
 * `MARK_GLYPHS` derivation engine/keywords.ts already uses cross-faction; documented here as
 * the CD-specific vocabulary that mechanism needs to recognise (§2). The Tzeentch ᵀ-glyph
 * collision with Terminator-compat is RESOLVED — by-design bucket-key split, see §1 footnote
 * "GLYPH POLICY" cross-ref in digest §7.1.
 */

export interface CdKeywordEntry {
  /** Keyword as it appears in canonical text, e.g. "Mark of Khorne", "Daemon" */
  keyword: string;
  /** Which axis this keyword belongs to (armour deliberately has zero entries — see header) */
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  /** What this keyword gates / grants (verbatim rule reference) */
  gates?: string;
}

// Source: rules-model/chaos_daemons.md §1 (vocabulary, VALIDATED 2026-06-03) + §4b (Marks/
// Favored Units/Animosity, VALIDATED — roster + Army Customisation re-read 2026-06-03).
export const CD_KEYWORDS: CdKeywordEntry[] = [
  // --- armour axis: NO ENTRIES (CD has no Terminator/Cataphractii/Gravis concept — §1 verbatim) ---

  // --- mark axis: the 4 Chaos gods (no Undivided in CD) ---
  {
    keyword: 'Mark of Khorne',
    axis: 'mark',
    gates: 'Veteran ability (counts toward unit\'s profile if locked): +1 Attack; Character/' +
      'Monstrous Creature additionally +1 Strength; Vehicles cause double hits on Tank Shock. ' +
      'Gates ᴷ-superscript armory items + Khorne-locked archetype (Goretide ᴷ). Sacred number 8 ' +
      '(Favored Units). Rival: Slaanesh (Animosity — mutually exclusive, cannot coexist as allies).',
  },
  {
    keyword: 'Mark of Nurgle',
    axis: 'mark',
    gates: 'Veteran ability: +1 Toughness; Character/Monstrous Creature additionally +1 Wound; ' +
      'Vehicles roll 2D6/Reinforcement phase, 7+ repairs/clears a malfunction. Gates ᴺ-superscript ' +
      'armory items + Nurgle-locked archetype (Popping Plague ᴺ). Sacred number 7. Rival: Tzeentch ' +
      '(Animosity — mutually exclusive).',
  },
  {
    keyword: 'Mark of Slaanesh',
    axis: 'mark',
    gates: 'Veteran ability: +1 Initiative; Character/Monstrous Creature additionally +2" Movement; ' +
      'Vehicles lower hostile Ld/melee result -1 within 18"/-2 within 9". Gates ˢ-superscript armory ' +
      'items + Slaanesh-locked archetype (Figureheads of The Dark Prince ˢ). Sacred number 6. Rival: ' +
      'Khorne (Animosity — mutually exclusive).',
  },
  {
    keyword: 'Mark of Tzeentch',
    axis: 'mark',
    gates: 'Veteran ability: "Warded"; Character/Monstrous Creature becomes psyker (or gains ' +
      '+1 manifest/deny if already one); Vehicles gain a Warpflamer (R9" Assault 4 S4 AP-1 D1, ' +
      'Flames). Gates ᵀ-superscript armory items (structurally bucketed in `armory_marks.Tzeentch`' +
      ' — by-design glyph-collision split, ᵀ already means Terminator-compat elsewhere) + ' +
      'Tzeentch-locked archetype (Host Duplicitous ᵀ). Sacred number 9. Rival: Nurgle (Animosity).',
  },

  // --- faction axis: blanket army-wide identity ---
  {
    keyword: 'Daemon',
    axis: 'faction',
    gates: 'Every CD unit carries this. Grants Daemon 5+ invulnerable save / Daemonic Instability ' +
      '(Core Rules special-rules block) — "Greater Daemon" variant (4+ inv) is the HQ pricing-tier ' +
      'name and the Entourage/Herald HQ-stacking keyword (up to two Heralds as a single HQ choice).',
  },

  // --- datasheet axis: deliberately EMPTY (see header note — grepped, all 37 `keywords[]` = []) ---
];
