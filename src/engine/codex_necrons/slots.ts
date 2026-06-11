/**
 * codex_necrons/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/necrons/units.json` (`slot_to_units` index + `units`
 * object keyed by name). Migrated from `rules-model/necrons.md` — digest built from the `.ods` canon
 * 2026-06-11 (Warriors + Monolith spot-checks match production).
 *
 * 37 units / 8 populated slots (uses every slot). EIGHTEENTH faction migrated — THE LAST of the 19
 * factions (after CSM pilot + Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial
 * Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark Eldar + Eldar +
 * Harlequins + Genestealer Cults + Orks + Tyranids + Leagues of Votann + T'au Empire).
 */

export interface NecronSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Fortifications' | 'Flyers';
}

// Source: data/parsed/necrons/units.json `slot_to_units` (production, canonical).
export const NECRON_SLOTS: NecronSlotEntry[] = [
  // --- HQ (5) ---
  { name: 'Ancient Destructor Lord', slot: 'HQ' },
  { name: 'Cryptek', slot: 'HQ' },
  { name: 'Lord', slot: 'HQ' },
  { name: 'Royal Warden', slot: 'HQ' },
  { name: 'Skorpekh Lord', slot: 'HQ' },

  // --- Troops (3) ---
  { name: 'Flayed Ones', slot: 'Troops' },
  { name: 'Immortals', slot: 'Troops' },
  { name: 'Warriors', slot: 'Troops' },

  // --- Elites (14) ---
  { name: "C'tan Shard", slot: 'Elites' },
  { name: "C'tan Shard of the Deceiver", slot: 'Elites' },
  { name: "C'tan Shard of the Dragon", slot: 'Elites' },
  { name: "C'tan Shard of the Nightbringer", slot: 'Elites' },
  { name: 'Canoptek Reanimator', slot: 'Elites' },
  { name: 'Canoptek Spyders', slot: 'Elites' },
  { name: 'Cryptothralls', slot: 'Elites' },
  { name: 'Deathmarks', slot: 'Elites' },
  { name: 'Hexmark Destroyer', slot: 'Elites' },
  { name: 'Lychguard', slot: 'Elites' },
  { name: 'Pariahs', slot: 'Elites' },
  { name: 'Plasmacyte', slot: 'Elites' },
  { name: 'Skorpekh Destroyers', slot: 'Elites' },
  { name: 'Triarch Stalker', slot: 'Elites' },

  // --- Fast Attack (5) ---
  { name: 'Canoptek Scarabs', slot: 'Fast Attack' },
  { name: 'Canoptek Wraiths', slot: 'Fast Attack' },
  { name: 'Ophydian Destroyers', slot: 'Fast Attack' },
  { name: 'Tomb Blades', slot: 'Fast Attack' },
  { name: 'Triarch Praetorians', slot: 'Fast Attack' },

  // --- Heavy Support (5) ---
  { name: 'Annihilation Barge', slot: 'Heavy Support' },
  { name: 'Canoptek Doomstalker', slot: 'Heavy Support' },
  { name: 'Doomsday Ark', slot: 'Heavy Support' },
  { name: 'Lokhust Destroyers', slot: 'Heavy Support' },
  { name: 'Monolith', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Ghost Ark', slot: 'Dedicated Transport' },
  { name: 'Catacomb Command Barge', slot: 'Dedicated Transport' },

  // --- Fortifications (1) ---
  { name: 'Convergence of Dominion', slot: 'Fortifications' },

  // --- Flyers (2) ---
  { name: 'Doom Scythe', slot: 'Flyers' },
  { name: 'Night Scythe', slot: 'Flyers' },
];
