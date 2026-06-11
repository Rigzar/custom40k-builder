/**
 * codex_leagues_of_votann/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/leagues_of_votann/units.json` (`slot_to_units` index
 * + `units` object keyed by name). Migrated from `rules-model/leagues_of_votann.md` — digest built
 * from the `.ods` canon 2026-06-11 (Hearthkyn Warriors + Hekaton Land Fortress spot-checks match
 * production).
 *
 * 18 units / 6 populated slots — SIXTEENTH faction migrated, after CSM (pilot) + Chaos Daemons +
 * Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus
 * Sororitas + Adeptus Custodes + Dark Eldar + Eldar + Harlequins + Genestealer Cults + Orks +
 * Tyranids.
 */

export interface VotannSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport';
}

// Source: data/parsed/leagues_of_votann/units.json `slot_to_units` (production, canonical).
export const VOTANN_SLOTS: VotannSlotEntry[] = [
  // --- HQ (3) ---
  { name: 'Brôkhyr Iron-master', slot: 'HQ' },
  { name: 'Grimnyr', slot: 'HQ' },
  { name: 'Kâhl', slot: 'HQ' },

  // --- Troops (2) ---
  { name: 'Hearthkyn Warriors', slot: 'Troops' },
  { name: 'Ironkin Steeljacks', slot: 'Troops' },

  // --- Elites (6) ---
  { name: 'Arkanyst Evaluator', slot: 'Elites' },
  { name: 'Cthonian Beserks', slot: 'Elites' },
  { name: 'Einhyr Champion', slot: 'Elites' },
  { name: 'Einhyr Hearthguard', slot: 'Elites' },
  { name: 'Hernkyn Yaegirs', slot: 'Elites' },
  { name: 'Memnyr Strategist', slot: 'Elites' },

  // --- Fast Attack (2) ---
  { name: 'Hernkyn Pioneers', slot: 'Fast Attack' },
  { name: 'Kapricus Defender', slot: 'Fast Attack' },

  // --- Heavy Support (3) ---
  { name: 'Brôkhyr Thunderkyn', slot: 'Heavy Support' },
  { name: 'Cthonian Earthshakers', slot: 'Heavy Support' },
  { name: 'Hekaton Land Fortress', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Kapricus Carrier', slot: 'Dedicated Transport' },
  { name: 'Sagitaur', slot: 'Dedicated Transport' },
];
