/**
 * codex_adeptus_mechanicus/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted programmatically from `data/parsed/adeptus_mechanicus/units.json`
 * (`slot_to_units` index + `units` object keyed by name — single units.json, like IG). Migrated
 * from `rules-model/adeptus_mechanicus.md` — digest built from the `.ods` canon 2026-06-11.
 *
 * 29 units / 7 populated slots (Fortifications = 0) — SEVENTH faction migrated, after CSM (pilot)
 * + Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard.
 */

export interface AdMechSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Flyers';
}

// Source: data/parsed/adeptus_mechanicus/units.json `slot_to_units` (production, canonical).
export const ADMECH_SLOTS: AdMechSlotEntry[] = [
  // --- HQ (2) ---
  { name: 'Magos', slot: 'HQ' },
  { name: 'Skitarii Marshal', slot: 'HQ' },

  // --- Troops (3) ---
  { name: 'Skitarii Rangers', slot: 'Troops' },
  { name: 'Skitarii Vanguard', slot: 'Troops' },
  { name: 'Tech Thralls', slot: 'Troops' },

  // --- Elites (11) ---
  { name: 'Corpuscarii Electro-Priests', slot: 'Elites' },
  { name: 'Fulgurite Electro-Priests', slot: 'Elites' },
  { name: 'Kataphron Breachers', slot: 'Elites' },
  { name: 'Kataphron Destroyers', slot: 'Elites' },
  { name: 'Secutarii Hoplites', slot: 'Elites' },
  { name: 'Secutarii Peltasts', slot: 'Elites' },
  { name: 'Servitors', slot: 'Elites' },
  { name: 'Sicaran Infiltrators', slot: 'Elites' },
  { name: 'Sicaran Ruststalkers', slot: 'Elites' },
  { name: 'Sydonian Skatros', slot: 'Elites' },
  { name: 'Tech-Priest', slot: 'Elites' },

  // --- Fast Attack (5) ---
  { name: 'Pteraxii Skystalkers', slot: 'Fast Attack' },
  { name: 'Pteraxii Sterylizors', slot: 'Fast Attack' },
  { name: 'Serberys Raiders', slot: 'Fast Attack' },
  { name: 'Serberys Sulphurhounds', slot: 'Fast Attack' },
  { name: 'Sydonian Dragoons', slot: 'Fast Attack' },

  // --- Heavy Support (5) ---
  { name: 'Ironstrider Ballistarii', slot: 'Heavy Support' },
  { name: 'Kastelan Robots', slot: 'Heavy Support' },
  { name: 'Macrocarid Explorator', slot: 'Heavy Support' },
  { name: 'Onager Dunecrawler', slot: 'Heavy Support' },
  { name: 'Skorpius Disintegrator', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Skorpius Dunerider', slot: 'Dedicated Transport' },
  { name: 'Termite', slot: 'Dedicated Transport' },

  // --- Flyers (1) ---
  { name: 'Archaeopter', slot: 'Flyers' },
];
