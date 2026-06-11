/**
 * codex_adeptus_sororitas/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/adeptus_sororitas/units.json` (`slot_to_units`
 * index + `units` object keyed by name — single units.json, like IG/AdMech). Migrated from
 * `rules-model/adeptus_sororitas.md` — digest built from the `.ods` canon 2026-06-11.
 *
 * 27 units / 6 populated slots (Fortifications = 0, Flyers = 0) — EIGHTH faction migrated, after
 * CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard +
 * Adeptus Mechanicus.
 */

export interface SororitasSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport';
}

// Source: data/parsed/adeptus_sororitas/units.json `slot_to_units` (production, canonical).
export const SORORITAS_SLOTS: SororitasSlotEntry[] = [
  // --- HQ (5) ---
  { name: 'Canoness in Paragon Warsuit', slot: 'HQ' },
  { name: 'Geminae Superia', slot: 'HQ' },
  { name: 'Living Saint', slot: 'HQ' },
  { name: 'Missionary', slot: 'HQ' },
  { name: 'Palatine', slot: 'HQ' },

  // --- Troops (2) ---
  { name: 'Battle Sisters Squad', slot: 'Troops' },
  { name: 'Sisters Novitiate', slot: 'Troops' },

  // --- Elites (11) ---
  { name: 'Arco-flagellants', slot: 'Elites' },
  { name: 'Celestian Insidiants', slot: 'Elites' },
  { name: 'Celestian Sacresants', slot: 'Elites' },
  { name: 'Celestian Squad', slot: 'Elites' },
  { name: 'Crusaders', slot: 'Elites' },
  { name: 'Dogmata', slot: 'Elites' },
  { name: 'Hospitaller', slot: 'Elites' },
  { name: 'Imagifier', slot: 'Elites' },
  { name: 'Paragon Warsuits', slot: 'Elites' },
  { name: 'Preacher', slot: 'Elites' },
  { name: 'Repentia Squad', slot: 'Elites' },

  // --- Fast Attack (3) ---
  { name: 'Dominion Squad', slot: 'Fast Attack' },
  { name: 'Seraphim Squad', slot: 'Fast Attack' },
  { name: 'Zephyrim Squad', slot: 'Fast Attack' },

  // --- Heavy Support (4) ---
  { name: 'Castigator', slot: 'Heavy Support' },
  { name: 'Exorcist', slot: 'Heavy Support' },
  { name: 'Penitent Engines', slot: 'Heavy Support' },
  { name: 'Retributor Squad', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Immolator', slot: 'Dedicated Transport' },
  { name: 'Rhino', slot: 'Dedicated Transport' },
];
