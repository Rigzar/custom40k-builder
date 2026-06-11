/**
 * codex_dark_eldar/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/dark_eldar/units.json` (`slot_to_units` index +
 * `units` object keyed by name). Migrated from `rules-model/dark_eldar.md` — digest built from the
 * `.ods` canon 2026-06-11.
 *
 * 19 units / 7 populated slots (Fortifications = 0) — TENTH faction migrated, after CSM (pilot) +
 * Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus
 * + Adeptus Sororitas + Adeptus Custodes.
 *
 * NOTE: `slot_to_units.Elites` also lists "Furious Charge" — a Power-through-Pain BONUS name that
 * leaked into the slot index, with no datasheet (`ki-dark-eldar-furiouscharge-phantom-01`).
 * EXCLUDED here; this catalogue lists only the 19 real units.
 */

export interface DarkEldarSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Flyers';
}

// Source: data/parsed/dark_eldar/units.json `slot_to_units` (production, canonical).
export const DARK_ELDAR_SLOTS: DarkEldarSlotEntry[] = [
  // --- HQ (3) ---
  { name: 'Dracon', slot: 'HQ' },
  { name: 'Haemonculus', slot: 'HQ' },
  { name: 'Succubus', slot: 'HQ' },

  // --- Troops (3) ---
  { name: 'Kabalite Warriors', slot: 'Troops' },
  { name: 'Wracks', slot: 'Troops' },
  { name: 'Wyches', slot: 'Troops' },

  // --- Elites (3 real; "Furious Charge" phantom excluded — see header) ---
  { name: 'Grotesques', slot: 'Elites' },
  { name: 'Incubi', slot: 'Elites' },
  { name: 'Mandrakes', slot: 'Elites' },

  // --- Fast Attack (3) ---
  { name: 'Hellions', slot: 'Fast Attack' },
  { name: 'Reavers', slot: 'Fast Attack' },
  { name: 'Scourges', slot: 'Fast Attack' },

  // --- Heavy Support (3) ---
  { name: 'Cronos', slot: 'Heavy Support' },
  { name: 'Ravager', slot: 'Heavy Support' },
  { name: 'Talos', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Raider', slot: 'Dedicated Transport' },
  { name: 'Venom', slot: 'Dedicated Transport' },

  // --- Flyers (2) ---
  { name: 'Razorwing Jetfighter', slot: 'Flyers' },
  { name: 'Voidraven Bomber', slot: 'Flyers' },
];
