/**
 * codex_eldar/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/eldar.md` §1. Three axes EMPTY in production; `datasheet` axis
 * carries the Aspect/Wraith sub-types as of v0.60 (`ki-eldar-aspect-wraith-keyword-01`, FIXED):
 * the 9 Aspect Warriors (Dire Avengers, Fire Dragons, Howling Banshees, Shadow Spectres,
 * Striking Scorpions, Shining Spears, Swooping Hawks, Warp Spiders, Dark Reapers) carry
 * `keywords: ["Aspect"]`, and the 4 Wraith units (Wraithblades, Wraithguard, Wraithlord,
 * Wraithseer) carry `keywords: ["Wraith"]`, per `Eldar ENG.ods` per-unit ability rows. The
 * "Aspect Focus" archetype's `troopsRemap` (engine/archetypes/index.ts) now lists the 9 Aspect
 * units explicitly, mirroring "Wraithhost"'s existing `troopsRemap: ['Wraithblades', 'Wraithguard']`.
 *
 *   - `armour` — EMPTY. Stat-tier Armory buy, no ᵀ-gate.
 *   - `mark` — EMPTY. No `locked_mark`.
 *   - `faction` — EMPTY. Battle Focus / Shuriken / Webway strike are army-wide datasheet rules.
 *   - `datasheet` — Aspect/Wraith sub-types (see above).
 */

export interface EldarKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/eldar.md §1 + Eldar ENG.ods per-unit ability rows (v0.60).
export const ELDAR_KEYWORDS: EldarKeywordEntry[] = [
  // --- armour axis: EMPTY — stat-tier Armory purchases, not a keyword gate. ---
  // --- mark axis: EMPTY — no locked_mark. ---
  // --- faction axis: EMPTY — Battle Focus / Shuriken / Webway strike are army-wide rules. ---
  { keyword: 'Aspect', axis: 'datasheet', gates: 'Aspect Focus archetype troopsRemap' },
  { keyword: 'Wraith', axis: 'datasheet', gates: 'Wraithhost archetype troopsRemap' },
];
