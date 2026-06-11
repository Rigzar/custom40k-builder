/**
 * codex_leagues_of_votann/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as VOTANN_SLOTS. Migrated from
 * `rules-model/leagues_of_votann.md` §1. ONE parser artifact: "Hernkyn Yaegirs" carries
 * `unit_type: "Infantry, Sniper: ..."` (an ability sentence leaked into the type; should be
 * "Infantry") — recorded verbatim-as-production with a comment, NOT silently corrected (cosmetic
 * fix scoped separately, `ki-unittype-residuals-01` family). No option-driven `set_unit_type` (the
 * Skimmer bike option grants the Jet bike type as a stat grant on infantry).
 */

export interface VotannUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/leagues_of_votann/units.json `units[name].unit_type` (production canonical).
export const VOTANN_UNIT_TYPES: VotannUnitTypeEntry[] = [
  // HQ
  { name: 'Brôkhyr Iron-master', unit_type: 'Character Model, Infantry' },
  { name: 'Grimnyr', unit_type: 'Character Model, Infantry' },
  { name: 'Kâhl', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Hearthkyn Warriors', unit_type: 'Infantry' },
  { name: 'Ironkin Steeljacks', unit_type: 'Infantry' },
  // Elites
  { name: 'Arkanyst Evaluator', unit_type: 'Character Model, Infantry' },
  { name: 'Cthonian Beserks', unit_type: 'Infantry' },
  { name: 'Einhyr Champion', unit_type: 'Character Model, Infantry' },
  { name: 'Einhyr Hearthguard', unit_type: 'Infantry' },
  // PARSER ARTIFACT — should be 'Infantry' (see header)
  { name: 'Hernkyn Yaegirs', unit_type: 'Infantry, Sniper: Models with a Magna-coil rifle receive a +1 bonus to their BS value.' },
  { name: 'Memnyr Strategist', unit_type: 'Character Model, Infantry' },
  // Fast Attack
  { name: 'Hernkyn Pioneers', unit_type: 'Jetbike' },
  { name: 'Kapricus Defender', unit_type: 'Vehicle' },
  // Heavy Support
  { name: 'Brôkhyr Thunderkyn', unit_type: 'Infantry' },
  { name: 'Cthonian Earthshakers', unit_type: 'Infantry' },
  { name: 'Hekaton Land Fortress', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Kapricus Carrier', unit_type: 'Vehicle' },
  { name: 'Sagitaur', unit_type: 'Vehicle' },
];
