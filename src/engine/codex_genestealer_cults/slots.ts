/**
 * codex_genestealer_cults/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/genestealer_cults/units.json` (`slot_to_units` index
 * + `units` object keyed by name). Migrated from `rules-model/genestealer_cults.md` — digest built
 * from the `.ods` canon 2026-06-11.
 *
 * 20 units / 6 populated slots — THIRTEENTH faction migrated, after CSM (pilot) + Chaos Daemons +
 * Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus + Adeptus
 * Sororitas + Adeptus Custodes + Dark Eldar + Eldar + Harlequins.
 */

export interface GscSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport';
}

// Source: data/parsed/genestealer_cults/units.json `slot_to_units` (production, canonical).
export const GSC_SLOTS: GscSlotEntry[] = [
  // --- HQ (4) ---
  { name: 'Acolyte Iconward', slot: 'HQ' },
  { name: 'Magus', slot: 'HQ' },
  { name: 'Patriarch', slot: 'HQ' },
  { name: 'Primus', slot: 'HQ' },

  // --- Troops (2) ---
  { name: 'Acolyte Hybrids', slot: 'Troops' },
  { name: 'Neophyte Hybrids', slot: 'Troops' },

  // --- Elites (10) ---
  { name: 'Abberants', slot: 'Elites' },
  { name: 'Abominant', slot: 'Elites' },
  { name: 'Biophagus', slot: 'Elites' },
  { name: 'Clamavus', slot: 'Elites' },
  { name: 'Nexos', slot: 'Elites' },
  { name: 'Purestrain Genestealers', slot: 'Elites' },
  { name: 'Reductus Saboteur', slot: 'Elites' },
  { name: 'Sanctus', slot: 'Elites' },
  { name: 'Kelermorph', slot: 'Elites' },
  { name: 'Locus', slot: 'Elites' },

  // --- Fast Attack (2) ---
  { name: 'Achilles Ridgerunners', slot: 'Fast Attack' },
  { name: 'Atalan Jackals', slot: 'Fast Attack' },

  // --- Heavy Support (1) ---
  { name: 'Goliath Rockgrinder', slot: 'Heavy Support' },

  // --- Dedicated Transport (1) ---
  { name: 'Goliath Truck', slot: 'Dedicated Transport' },
];
