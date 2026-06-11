/**
 * codex_adeptus_custodes/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/adeptus_custodes/units.json` (`slot_to_units` index
 * + `units` object keyed by name). Migrated from `rules-model/adeptus_custodes.md` — digest built
 * from the `.ods` canon 2026-06-11.
 *
 * 19 units / 6 populated slots (Fortifications = 0, Flyers = 0) — NINTH faction migrated, after
 * CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard +
 * Adeptus Mechanicus + Adeptus Sororitas.
 *
 * NOTE: `slot_to_units.Elites` also lists "Vigilators" (a Sisters-of-Silence melee build) but
 * production has NO `units["Vigilators"]` datasheet — a phantom roster reference
 * (`ki-custodes-vigilators-phantom-01`). EXCLUDED here; this catalogue lists only the 19 real units.
 */

export interface CustodesSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport';
}

// Source: data/parsed/adeptus_custodes/units.json `slot_to_units` (production, canonical).
export const CUSTODES_SLOTS: CustodesSlotEntry[] = [
  // --- HQ (4) ---
  { name: 'Blade Champion', slot: 'HQ' },
  { name: 'Knight-Centura', slot: 'HQ' },
  { name: 'Shield-Captain', slot: 'HQ' },
  { name: 'Shield-Captain on Jetbike', slot: 'HQ' },

  // --- Troops (3) ---
  { name: 'Custodian Guard', slot: 'Troops' },
  { name: 'Sagittarum Custodians', slot: 'Troops' },
  { name: 'Sisters of Silence', slot: 'Troops' },

  // --- Elites (6 real; "Vigilators" phantom excluded — see header) ---
  { name: 'Allarus Custodians', slot: 'Elites' },
  { name: 'Aquilon Custodians', slot: 'Elites' },
  { name: 'Galatus Contemptor Dreadnought', slot: 'Elites' },
  { name: 'Custodian Wardens', slot: 'Elites' },
  { name: 'Venerable Contemptor Dreadnought', slot: 'Elites' },
  { name: 'Vertus Praetor', slot: 'Elites' },

  // --- Fast Attack (1) ---
  { name: 'Jetbike Custodians', slot: 'Fast Attack' },

  // --- Heavy Support (3) ---
  { name: 'Caladius Grav-Tank', slot: 'Heavy Support' },
  { name: 'Telemon Heavy Dreadnought', slot: 'Heavy Support' },
  { name: 'Venerable Land Raider', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Rhino', slot: 'Dedicated Transport' },
  { name: 'Coronus Grav-carrier', slot: 'Dedicated Transport' },
];
