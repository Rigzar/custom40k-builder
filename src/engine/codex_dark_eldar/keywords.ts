/**
 * codex_dark_eldar/keywords — category 3 of 5 (Keyword).
 *
 * Migrated from `rules-model/dark_eldar.md` §1. HEADLINE: Dark Eldar is the SECOND faction (after
 * CSM) with a POPULATED `datasheet` axis — its three sub-factions (Kabal/Coven/Cult) are modelled
 * via the unit `keywords[]` array (the target keyword model, decision 2026-06-03). Every other
 * faction migrated so far (CD/SM/Inquisition/GK/IG/AdMech/Sororitas/Custodes) had it empty.
 *
 *   - `datasheet` — POPULATED (3 sub-factions + "all" + "none"). Drives the sub-faction-purity
 *     archetypes (Trueborn=Kabal-only / Haemoxytes=Coven-only / Bloodbrides=Cult-only) AND the
 *     "Only for <Coven>/<Cult>/<Kabal>" trait & item gating.
 *   - `armour` — EMPTY. Armour is a stat-tier Armory buy (Ghostplate 5+inv, Executioner's 2+,
 *     Shadow field 2+inv one-shot), not a keyword gate.
 *   - `mark` — EMPTY. No `locked_mark` — the sub-faction is the `keywords[]` array, NOT the
 *     `locked_mark` mark-attribute that CSM/CD use (a different primitive for a mark-like concept).
 *   - `faction` — EMPTY. Combat drugs / Power through Pain / Webway raid are army-wide datasheet
 *     rules, not a per-unit identity keyword beyond the sub-faction (which is `datasheet`).
 */

export interface DarkEldarKeywordEntry {
  keyword: string;
  axis: 'armour' | 'mark' | 'faction' | 'datasheet';
  /** Units carrying this keyword (verbatim from production `keywords[]`) */
  units?: string[];
  gates?: string;
}

// Source: rules-model/dark_eldar.md §1 (sub-faction keywords[] from production).
export const DARK_ELDAR_KEYWORDS: DarkEldarKeywordEntry[] = [
  // --- datasheet axis: POPULATED with the 3 sub-factions (2nd faction after CSM) ---
  {
    keyword: 'Kabal',
    axis: 'datasheet',
    units: ['Dracon', 'Kabalite Warriors'],
    gates: 'Sub-faction. Trueborn archetype restricts the army to Kabal-only units; "Only for ' +
      '<Kabal>" traits/items gate on it. Also carried by the shared all-three vehicles/flyers.',
  },
  {
    keyword: 'Coven',
    axis: 'datasheet',
    units: ['Haemonculus', 'Wracks', 'Grotesques', 'Cronos', 'Talos'],
    gates: 'Sub-faction. Haemoxytes archetype restricts the army to Coven-only units; "Only for ' +
      '<Coven>" traits/items gate on it. Legacy "Butchers of Flesh" grants the Coven Armory.',
  },
  {
    keyword: 'Cult',
    axis: 'datasheet',
    units: ['Succubus', 'Wyches', 'Hellions', 'Reavers'],
    gates: 'Sub-faction (the `.ods` `<Wyches>`/`<Cult>`). Bloodbrides archetype restricts the army ' +
      'to Cult-only units; "Only for <Cult>" traits/items gate on it. Legacy "Spectacle of Murder" ' +
      'grants the Wych Armory.',
  },
  {
    keyword: 'Coven, Cult, Kabal',
    axis: 'datasheet',
    units: ['Ravager', 'Raider', 'Venom', 'Razorwing Jetfighter', 'Voidraven Bomber'],
    gates: 'Available to ALL three sub-factions — the shared vehicles + flyers, never restricted ' +
      'out by a sub-faction-purity archetype.',
  },
  {
    keyword: '-',
    axis: 'datasheet',
    units: ['Incubi', 'Mandrakes', 'Scourges'],
    gates: 'NO sub-faction — mercenary/independent units. Carry no sub-faction keyword, so a ' +
      'sub-faction-purity archetype (Trueborn/Haemoxytes/Bloodbrides) would exclude them.',
  },

  // --- armour axis: EMPTY — stat-tier Armory purchases, not a keyword gate. ---
  // --- mark axis: EMPTY — sub-faction lives in `keywords[]` (datasheet), not `locked_mark`. ---
  // --- faction axis: EMPTY — Combat drugs / Power through Pain / Webway raid are army-wide rules. ---
];
