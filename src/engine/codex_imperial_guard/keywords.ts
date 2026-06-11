/**
 * codex_imperial_guard/keywords — category 3 of 5 in the codex.ts data model (Keyword).
 *
 * Catalogue of Imperial Guard's keyword vocabulary, migrated from `rules-model/imperial_guard.md`
 * §1.
 *
 * SIMPLEST keyword vocabulary of ANY faction migrated: ALL FOUR axes are EMPTY. IG is the first
 * faction with no armour gate at all (even Inquisition/GK had a single binary ᵀ-gate). Its entire
 * wargear gating runs on prose ("Only for X") + boolean unit flags (`is_vehicle`/`is_character`/
 * `is_psyker`/`has_veteran_abilities`) — see weapon-abilities.ts (Step 5). This catalogue
 * therefore documents the deliberate ABSENCE of each axis (grounded, not an oversight).
 *
 *   - `armour` — EMPTY. Grepped all 60 units: `armourKeyword` populated on ZERO. IG armour is a
 *     STAT-TIER purchase from the Armory (Plate → 4+ Sv, Master-crafted armor → 2+ Sv, Refractor
 *     field → 5+ inv, Bionics → 6+ inv), never a keyword gating an equipment subset.
 *   - `mark` — EMPTY intrinsically. No `locked_mark` on any unit. Marks of Chaos exist ONLY as a
 *     purchasable upgrade unlocked by the Traitor Guard archetype (+1/+2 per model & Wound, +10
 *     per vehicle) — an archetype-gated OPTION, not a unit-identity axis (see GK_SPECIAL_ABILITIES
 *     analogue + [[project_traitor_guard_bugfix_0608]]).
 *   - `faction` — EMPTY. No army-wide rule rides on a per-unit identity keyword. The Orders
 *     mechanic gates on unit TYPE (Infantry vs Vehicle order lists) + officer proximity, not a
 *     keyword; carried in special-abilities.ts.
 *   - `datasheet` — EMPTY. Grepped all 60 units' `keywords[]` → 60/60 empty. SIXTH confirmation
 *     (CSM=6, CD/SM/Inquisition/GK/now IG=0) that a populated datasheet axis is the per-faction
 *     EXCEPTION — CSM is increasingly the lone outlier.
 */

export interface IgKeywordEntry {
  /** Keyword as it appears in canonical text */
  keyword: string;
  /** Which axis this keyword belongs to */
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  /** What this keyword gates / grants (verbatim rule reference) */
  gates?: string;
}

// Source: rules-model/imperial_guard.md §1. ALL axes deliberately empty (see header) — IG gates
// wargear via prose + unit flags, documented in weapon-abilities.ts, not via keywords.
export const IG_KEYWORDS: IgKeywordEntry[] = [
  // --- armour axis: EMPTY — IG armour is a stat-tier Armory purchase, not a keyword gate.
  //     First faction migrated with no armour gate whatsoever (Inquisition/GK had a ᵀ-gate). ---

  // --- mark axis: EMPTY intrinsically — Marks of Chaos only via the Traitor Guard archetype
  //     option, never a base unit-identity keyword (no locked_mark on any of the 60 units). ---

  // --- faction axis: EMPTY — Orders gate on unit type + officer range, not a faction keyword. ---

  // --- datasheet axis: EMPTY — grepped all 60 units' keywords[] = []. SIXTH confirmation a
  //     populated datasheet axis is the per-faction exception (CSM the lone outlier). ---
];
