/**
 * codex_tyranids/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/tyranids/units.json` (`slot_to_units` index +
 * `units` object keyed by name). Migrated from `rules-model/tyranids.md` — digest built from the
 * `.ods` canon 2026-06-11 (Hive Tyrant datasheet spot-check matches production).
 *
 * 40 units / 8 populated slots (uses every slot). FIFTEENTH faction migrated, after CSM (pilot) +
 * Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus
 * + Adeptus Sororitas + Adeptus Custodes + Dark Eldar + Eldar + Harlequins + Genestealer Cults +
 * Orks.
 */

export interface TyranidSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Fortifications' | 'Flyers';
}

// Source: data/parsed/tyranids/units.json `slot_to_units` (production, canonical).
export const TYRANID_SLOTS: TyranidSlotEntry[] = [
  // --- HQ (7) ---
  { name: 'Hive Tyrant', slot: 'HQ' },
  { name: 'Malanthrope', slot: 'HQ' },
  { name: 'Neurotyrant', slot: 'HQ' },
  { name: 'Swarmlord', slot: 'HQ' },
  { name: 'Tervigon', slot: 'HQ' },
  { name: 'Tyranid Prime', slot: 'HQ' },
  { name: 'Tyrant Guard Brood', slot: 'HQ' },

  // --- Troops (7) ---
  { name: 'Barbgaunt Brood', slot: 'Troops' },
  { name: 'Genestealer Brood', slot: 'Troops' },
  { name: 'Hormagaunt Brood', slot: 'Troops' },
  { name: 'Neurogaunt Brood', slot: 'Troops' },
  { name: 'Ripper Swarms', slot: 'Troops' },
  { name: 'Termagant Brood', slot: 'Troops' },
  { name: 'Tyranid Warrior Brood', slot: 'Troops' },

  // --- Elites (9) ---
  { name: 'Deathleaper', slot: 'Elites' },
  { name: 'Haruspex', slot: 'Elites' },
  { name: 'Hive Guard Brood', slot: 'Elites' },
  { name: 'Lictor Brood', slot: 'Elites' },
  { name: 'Maleceptor', slot: 'Elites' },
  { name: 'Toxicrene', slot: 'Elites' },
  { name: 'Venomthrope Brood', slot: 'Elites' },
  { name: "Von Ryan's Leaper Brood", slot: 'Elites' },
  { name: 'Zoanthrope Brood', slot: 'Elites' },

  // --- Fast Attack (9) ---
  { name: 'Gargoyle Brood', slot: 'Fast Attack' },
  { name: 'Mawloc', slot: 'Fast Attack' },
  { name: 'Mucolid Spore Cluster', slot: 'Fast Attack' },
  { name: 'Parasite of Mortrex', slot: 'Fast Attack' },
  { name: 'Psychophage', slot: 'Fast Attack' },
  { name: 'Pyrovore Brood', slot: 'Fast Attack' },
  { name: 'Ravener Brood', slot: 'Fast Attack' },
  { name: 'Spore Mine Cluster', slot: 'Fast Attack' },
  { name: 'Trygon', slot: 'Fast Attack' },

  // --- Heavy Support (5) ---
  { name: 'Biovore Brood', slot: 'Heavy Support' },
  { name: 'Carnifex Brood', slot: 'Heavy Support' },
  { name: 'Exocrine', slot: 'Heavy Support' },
  { name: 'Norn', slot: 'Heavy Support' },
  { name: 'Tyrannofex', slot: 'Heavy Support' },

  // --- Dedicated Transport (1) ---
  { name: 'Tyrannocyte', slot: 'Dedicated Transport' },

  // --- Fortifications (1) ---
  { name: 'Sporecyst', slot: 'Fortifications' },

  // --- Flyers (1) ---
  { name: 'Harpy', slot: 'Flyers' },
];
