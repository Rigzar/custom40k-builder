/**
 * codex_adeptus_mechanicus/keywords — category 3 of 5 in the codex.ts data model (Keyword).
 *
 * Migrated from `rules-model/adeptus_mechanicus.md` §1. Like Imperial Guard, ALL FOUR axes are
 * EMPTY — AdMech gates wargear via prose ("Only for X" / "Forge World X only") + boolean flags +
 * per-datasheet options (Doctrina Imperative), never a keyword. SECOND faction (after IG) with no
 * armour gate at all. This catalogue documents the deliberate ABSENCE of each axis.
 *
 *   - `armour` — EMPTY. No `armourKeyword` on any of 29 units. Armour is a stat-tier Armory buy
 *     (Bionics/Enhanced Bionics/Conversion field/Master-crafted armor/Stasis field).
 *   - `mark` — EMPTY intrinsically. No `locked_mark`. Marks of Chaos only via the Dark Mechanicum
 *     archetype option (see ADMECH_SPECIAL_ABILITIES + [[project_traitor_guard_bugfix_0608]]).
 *   - `faction` — EMPTY. The Canticles mechanic gates on the "Canticles of the Omnissiah" datasheet
 *     rule + Choir-Master proximity + the Monotask exception, not a faction identity keyword.
 *     (Forge World is a LEGACY axis — armory+canticle unlock — not a base keyword; §5.)
 *   - `datasheet` — EMPTY. Grepped all 29 units' keywords[] = []. SEVENTH confirmation a populated
 *     datasheet axis is the CSM-only exception.
 */

export interface AdMechKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/adeptus_mechanicus.md §1. ALL axes deliberately empty (see header).
export const ADMECH_KEYWORDS: AdMechKeywordEntry[] = [
  // --- armour axis: EMPTY — stat-tier Armory purchases, not a keyword gate (2nd faction after IG). ---
  // --- mark axis: EMPTY intrinsically — Marks of Chaos only via Dark Mechanicum archetype. ---
  // --- faction axis: EMPTY — Canticles gate on datasheet rule + Choir Master, not a keyword;
  //     Forge World is a Legacy-unlock axis (§5), not a base keyword. ---
  // --- datasheet axis: EMPTY — all 29 units keywords[] = []. ---
];
