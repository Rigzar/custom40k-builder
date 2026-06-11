/**
 * codex_orks/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/orks/units.json` (`slot_to_units` index + `units`
 * object keyed by name). Migrated from `rules-model/orks.md` — digest built from the `.ods` canon
 * 2026-06-11 (datasheet spot-checks: Boyz + Battlewagon match production exactly).
 *
 * 41 units / 8 populated slots — FIRST faction migrated with a populated Fortifications slot.
 * FOURTEENTH faction, after CSM (pilot) + Chaos Daemons + Space Marines + Inquisition + Grey
 * Knights + Imperial Guard + Adeptus Mechanicus + Adeptus Sororitas + Adeptus Custodes + Dark Eldar
 * + Eldar + Harlequins + Genestealer Cults.
 */

export interface OrkSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Fortifications' | 'Flyers';
}

// Source: data/parsed/orks/units.json `slot_to_units` (production, canonical).
export const ORK_SLOTS: OrkSlotEntry[] = [
  // --- HQ (4) ---
  { name: 'Big Mek', slot: 'HQ' },
  { name: 'Boss', slot: 'HQ' },
  { name: 'Dok', slot: 'HQ' },
  { name: 'Weirdboy', slot: 'HQ' },

  // --- Troops (5) ---
  { name: 'Beast Snagga Boyz', slot: 'Troops' },
  { name: 'Boyz', slot: 'Troops' },
  { name: 'Gretchins', slot: 'Troops' },
  { name: 'Skarboyz', slot: 'Troops' },
  { name: 'Snotlings', slot: 'Troops' },

  // --- Elites (8) ---
  { name: 'Burna Boyz', slot: 'Elites' },
  { name: 'Cybork Slashaz', slot: 'Elites' },
  { name: 'Kommandos', slot: 'Elites' },
  { name: 'Mekboy', slot: 'Elites' },
  { name: 'Mekboy Junka', slot: 'Elites' },
  { name: 'Nobz', slot: 'Elites' },
  { name: 'Painboy', slot: 'Elites' },
  { name: 'Tankbustas', slot: 'Elites' },

  // --- Fast Attack (7) ---
  { name: 'Deffkoptaz', slot: 'Fast Attack' },
  { name: 'Grot Tanks', slot: 'Fast Attack' },
  { name: 'Squighog Boyz', slot: 'Fast Attack' },
  { name: 'Stormboyz', slot: 'Fast Attack' },
  { name: 'Warbikers', slot: 'Fast Attack' },
  { name: 'Warbuggy', slot: 'Fast Attack' },
  { name: 'Warkopta', slot: 'Fast Attack' },

  // --- Heavy Support (10) ---
  { name: 'Battle Fortress', slot: 'Heavy Support' },
  { name: 'Battlewagon', slot: 'Heavy Support' },
  { name: 'Deff Dreads', slot: 'Heavy Support' },
  { name: 'Flash Gits', slot: 'Heavy Support' },
  { name: 'Hunta Rig', slot: 'Heavy Support' },
  { name: 'Killa Kans', slot: 'Heavy Support' },
  { name: 'Killa Rig', slot: 'Heavy Support' },
  { name: 'Lootas', slot: 'Heavy Support' },
  { name: 'Mek Gunz', slot: 'Heavy Support' },
  { name: 'Wagon', slot: 'Heavy Support' },

  // --- Dedicated Transport (4) ---
  { name: 'Kan', slot: 'Dedicated Transport' },
  { name: 'Looted Valkyrie', slot: 'Dedicated Transport' },
  { name: 'Squiggoth', slot: 'Dedicated Transport' },
  { name: 'Trukk', slot: 'Dedicated Transport' },

  // --- Fortifications (1) ---
  { name: "Big'ed Bossbunka", slot: 'Fortifications' },

  // --- Flyers (2) ---
  { name: 'Fighta-Bommer', slot: 'Flyers' },
  { name: 'Wazbom Blastajet', slot: 'Flyers' },
];
