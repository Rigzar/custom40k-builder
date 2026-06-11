/**
 * codex_eldar/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/eldar.md` §1. ALL FOUR axes EMPTY in production. NOTE: the `.ods`
 * archetypes reference two sub-type keywords — `<Aspect>` (Aspect Focus) and `<Wraith>` (Wraithhost)
 * — but production carries `keywords: []` on all 38 units, so these sub-types are NOT keyword-
 * tagged (unlike Dark Eldar, whose Kabal/Coven/Cult sub-factions ARE in `keywords[]`). The
 * archetype slot-remaps currently resolve Aspect/Wraith by unit identity, not keyword. Documented
 * as `ki-eldar-aspect-wraith-keyword-01` (see special-abilities.ts) — a candidate for keyword-
 * tagging to bring Eldar in line with the Dark Eldar model.
 *
 *   - `armour` — EMPTY. Stat-tier Armory buy, no ᵀ-gate.
 *   - `mark` — EMPTY. No `locked_mark`.
 *   - `faction` — EMPTY. Battle Focus / Shuriken / Webway strike are army-wide datasheet rules.
 *   - `datasheet` — EMPTY in production. (Aspect/Wraith sub-types referenced in archetypes but not
 *     tagged — see header + special-abilities.ts gap-note.)
 */

export interface EldarKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  gates?: string;
}

// Source: rules-model/eldar.md §1. ALL axes empty in production (Aspect/Wraith referenced in
// archetypes but not modelled as keywords[] — see header).
export const ELDAR_KEYWORDS: EldarKeywordEntry[] = [
  // --- armour axis: EMPTY — stat-tier Armory purchases, not a keyword gate. ---
  // --- mark axis: EMPTY — no locked_mark. ---
  // --- faction axis: EMPTY — Battle Focus / Shuriken / Webway strike are army-wide rules. ---
  // --- datasheet axis: EMPTY in production. The .ods archetypes reference <Aspect>/<Wraith>
  //     sub-types, but no unit carries them in keywords[] (ki-eldar-aspect-wraith-keyword-01). ---
];
