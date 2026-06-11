/**
 * codex_grey_knights/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted programmatically from `data/parsed/grey_knights/units/<slot>/*.ts`
 * (combined-extraction pass — `name`+`unit_type` co-locate in the same file, the same cheap
 * variant used for SM/Inquisition Pasos 1-2: see [[project_inquisition_codex_migration]]).
 * Migrated from `rules-model/grey_knights.md` — digest built from scratch 2026-06-08, §6.4
 * confirms a clean roster cross-check (zero drift) against `Index.html`.
 *
 * 22 units / 7 slots — fifth faction migrated, after CSM (pilot) + Chaos Daemons + Space Marines
 * + Inquisition.
 */

export interface GkSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Flyers';
}

// Source: data/parsed/grey_knights/units/<slot>/*.ts (production, canonical for roster shape).
export const GK_SLOTS: GkSlotEntry[] = [
  // --- HQ (5) ---
  { name: 'Brotherhood Champion', slot: 'HQ' },
  { name: 'Captain', slot: 'HQ' },
  { name: 'Captain in Nemesis Armor', slot: 'HQ' },
  { name: 'Chaplain', slot: 'HQ' },
  { name: 'Librarian', slot: 'HQ' },

  // --- Troops (2) ---
  { name: 'Strike Squad', slot: 'Troops' },
  { name: 'Terminator Squad', slot: 'Troops' },

  // --- Elites (6) ---
  { name: 'Ancient', slot: 'Elites' },
  { name: 'Apothecary', slot: 'Elites' },
  { name: 'Dreadnought', slot: 'Elites' },
  { name: 'Ghost Terminator Squad', slot: 'Elites' },
  { name: 'Paladin Squad', slot: 'Elites' },
  { name: 'Purifier Squad', slot: 'Elites' },

  // --- Fast Attack (1) ---
  { name: 'Interceptor Squad', slot: 'Fast Attack' },

  // --- Heavy Support (5) ---
  { name: 'Land Raider', slot: 'Heavy Support' },
  { name: 'Land Raider Crusader', slot: 'Heavy Support' },
  { name: 'Land Raider Redeemer', slot: 'Heavy Support' },
  { name: 'Nemesis Dreadknight', slot: 'Heavy Support' },
  { name: 'Purgator Squad', slot: 'Heavy Support' },

  // --- Dedicated Transport (2) ---
  { name: 'Razorback', slot: 'Dedicated Transport' },
  { name: 'Rhino', slot: 'Dedicated Transport' },

  // --- Flyers (1) ---
  { name: 'Stormraven Gunship', slot: 'Flyers' },
];
