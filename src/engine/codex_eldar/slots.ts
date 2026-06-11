/**
 * codex_eldar/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/eldar/units.json` (`slot_to_units` index + `units`
 * object keyed by name). Migrated from `rules-model/eldar.md` — digest built from the `.ods` canon
 * 2026-06-11.
 *
 * 38 units / 7 populated slots (Fortifications = 0) — LARGEST faction migrated so far. ELEVENTH
 * faction, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey Knights +
 * Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark Eldar.
 */

export interface EldarSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Flyers';
}

// Source: data/parsed/eldar/units.json `slot_to_units` (production, canonical).
export const ELDAR_SLOTS: EldarSlotEntry[] = [
  // --- HQ (6) ---
  { name: 'Autarch', slot: 'HQ' },
  { name: 'Avatar of Khaine', slot: 'HQ' },
  { name: 'Farseer', slot: 'HQ' },
  { name: 'Spiritseer', slot: 'HQ' },
  { name: 'Wraithseer', slot: 'HQ' },
  { name: 'Yncarne', slot: 'HQ' },

  // --- Troops (5) ---
  { name: 'Corsair Voidreavers', slot: 'Troops' },
  { name: 'Guardian Defenders', slot: 'Troops' },
  { name: 'Rangers', slot: 'Troops' },
  { name: 'Storm Guardians', slot: 'Troops' },
  { name: 'Wasps', slot: 'Troops' },

  // --- Elites (10) ---
  { name: 'Corsair Voidscarred', slot: 'Elites' },
  { name: 'Dire Avengers', slot: 'Elites' },
  { name: 'Fire Dragons', slot: 'Elites' },
  { name: 'Howling Banshees', slot: 'Elites' },
  { name: 'Shadow Spectres', slot: 'Elites' },
  { name: 'Striking Scorpions', slot: 'Elites' },
  { name: 'Warlocks', slot: 'Elites' },
  { name: 'Wraithblades', slot: 'Elites' },
  { name: 'Wraithguard', slot: 'Elites' },
  { name: 'Wraithlord', slot: 'Elites' },

  // --- Fast Attack (7) ---
  { name: 'Hornets', slot: 'Fast Attack' },
  { name: 'Shining Spears', slot: 'Fast Attack' },
  { name: 'Shroud Runners', slot: 'Fast Attack' },
  { name: 'Swooping Hawks', slot: 'Fast Attack' },
  { name: 'Vypers', slot: 'Fast Attack' },
  { name: 'Warp Spiders', slot: 'Fast Attack' },
  { name: 'Windriders', slot: 'Fast Attack' },

  // --- Heavy Support (6) ---
  { name: 'Dark Reapers', slot: 'Heavy Support' },
  { name: 'Falcon', slot: 'Heavy Support' },
  { name: 'Fire Prism', slot: 'Heavy Support' },
  { name: 'Night Spinner', slot: 'Heavy Support' },
  { name: 'Support Weapons', slot: 'Heavy Support' },
  { name: 'War Walkers', slot: 'Heavy Support' },

  // --- Dedicated Transport (1) ---
  { name: 'Wave Serpent', slot: 'Dedicated Transport' },

  // --- Flyers (3) ---
  { name: 'Crimson Hunter', slot: 'Flyers' },
  { name: 'Nightwing', slot: 'Flyers' },
  { name: 'Phoenix', slot: 'Flyers' },
];
