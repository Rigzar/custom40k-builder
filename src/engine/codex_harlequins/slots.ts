/**
 * codex_harlequins/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/harlequins/units.json` (`slot_to_units` index +
 * `units` object keyed by name). Migrated from `rules-model/harlequins.md` — digest built from the
 * `.ods` canon 2026-06-11.
 *
 * 9 units / 6 populated slots — SMALLEST faction migrated. TWELFTH faction, after CSM (pilot) +
 * Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus
 * + Adeptus Sororitas + Adeptus Custodes + Dark Eldar + Eldar.
 *
 * Harlequins are also a native ally for Eldar AND Dark Eldar (their "Visitors of the Black Library"
 * army rule grants access; Harlequins cannot be the mandatory HQ).
 */

export interface HarlequinsSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport';
}

// Source: data/parsed/harlequins/units.json `slot_to_units` (production, canonical).
export const HARLEQUINS_SLOTS: HarlequinsSlotEntry[] = [
  // --- HQ (1) ---
  { name: 'Great Harlequin', slot: 'HQ' },

  // --- Troops (1) ---
  { name: 'Troupe', slot: 'Troops' },

  // --- Elites (3) ---
  { name: 'Death Jester', slot: 'Elites' },
  { name: 'Shadowseer', slot: 'Elites' },
  { name: 'Solitaire', slot: 'Elites' },

  // --- Fast Attack (1) ---
  { name: 'Skyweavers', slot: 'Fast Attack' },

  // --- Heavy Support (2) ---
  { name: 'Harlequin Wraithlord', slot: 'Heavy Support' },
  { name: 'Voidweaver', slot: 'Heavy Support' },

  // --- Dedicated Transport (1) ---
  { name: 'Starweaver', slot: 'Dedicated Transport' },
];
