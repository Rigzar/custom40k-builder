/**
 * codex_necrons/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/necrons.md` §1. `keywords[]` is EMPTY on all 37 units; the Necron /
 * Canoptek sub-factions live in `unit_type` (like Tau's Kroot). armour/mark axes empty.
 *
 *   - `armour` — EMPTY. No `armourKeyword`/`term_compat`/glyph. Defence is invuln items (Sempiternal
 *     weave / Phase shifter / phase invuln), not an armour keyword.
 *   - `mark` — EMPTY. No `locked_mark`. (Dynasties are the Legacy axis, §5.)
 *   - `faction` — Necron / Canoptek (+ Cryptek / Lord) sub-types live in `unit_type`, NOT
 *     `keywords[]`. Canoptek Court archetype gates on <Canoptek>; traits gate on <Necron>/<Canoptek>.
 *   - `datasheet` — EMPTY. All 37 units `keywords[]` = [].
 */

export interface NecronKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/necrons.md §1.
export const NECRON_KEYWORDS: NecronKeywordEntry[] = [
  {
    keyword: 'Necron',
    axis: 'faction',
    gates: 'Faction sub-type, encoded in `unit_type` ("..., Necron" on most units), NOT `keywords[]`. ' +
      'Several traits gate "Only for <Necron>" (Eternal Conquerors etc.).',
  },
  {
    keyword: 'Canoptek',
    axis: 'faction',
    gates: 'Construct sub-type, encoded in `unit_type` ("..., Canoptek" on Scarabs/Wraiths/Spyders/' +
      'Reanimator/Doomstalker). The Canoptek Court archetype grants <Canoptek> units Objective ' +
      'Secured! A different encoding from Dark Eldar\'s keywords[] sub-factions — candidate to ' +
      'promote into keywords[] in a future keyword-engine refactor.',
  },

  // --- armour axis: EMPTY — invuln items, not a keyword gate; no ᵀ/ᴹ/ᴱ/ᴵ glyph. ---
  // --- mark axis: EMPTY — no locked_mark. Dynasties are the Legacy axis (§5). ---
  // --- datasheet axis: EMPTY — all 37 units keywords[] = [] (sub-types live in unit_type). ---
];
