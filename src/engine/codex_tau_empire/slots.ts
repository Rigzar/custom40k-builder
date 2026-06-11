/**
 * codex_tau_empire/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted from `data/parsed/tau_empire/units.json` (`slot_to_units` index +
 * `units` object keyed by name). Migrated from `rules-model/tau_empire.md` — digest built from the
 * `.ods` canon 2026-06-11 (Crisis Battlesuits + Hammerhead Gunship spot-checks match production).
 *
 * 42 units / 8 populated slots (uses every slot). SEVENTEENTH faction migrated, after CSM (pilot) +
 * Chaos Daemons + Space Marines + Inquisition + Grey Knights + Imperial Guard + Adeptus Mechanicus
 * + Adeptus Sororitas + Adeptus Custodes + Dark Eldar + Eldar + Harlequins + Genestealer Cults +
 * Orks + Tyranids + Leagues of Votann.
 */

export interface TauSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Fortifications' | 'Flyers';
}

// Source: data/parsed/tau_empire/units.json `slot_to_units` (production, canonical).
export const TAU_SLOTS: TauSlotEntry[] = [
  // --- HQ (5) ---
  { name: 'Commander', slot: 'HQ' },
  { name: 'Ethereal', slot: 'HQ' },
  { name: 'Ethereal Guard', slot: 'HQ' },
  { name: 'Kroot Master Shaper', slot: 'HQ' },
  { name: 'Sub-Commander', slot: 'HQ' },

  // --- Troops (4) ---
  { name: 'Breacher Team', slot: 'Troops' },
  { name: 'Kroot Carnivores', slot: 'Troops' },
  { name: 'Strike Team', slot: 'Troops' },
  { name: 'Support Turrets', slot: 'Troops' },

  // --- Elites (7) ---
  { name: 'Crisis Battlesuits', slot: 'Elites' },
  { name: 'Crisis Honor Guard', slot: 'Elites' },
  { name: 'Ghostkeel Battlesuits', slot: 'Elites' },
  { name: 'Kroot Farstalkers', slot: 'Elites' },
  { name: 'Kroot Lone-Spear', slot: 'Elites' },
  { name: 'Kroot Shaper', slot: 'Elites' },
  { name: 'Stealth Battlesuits', slot: 'Elites' },

  // --- Fast Attack (14) ---
  { name: 'Firesight Marksman', slot: 'Fast Attack' },
  { name: 'Great Knarloc', slot: 'Fast Attack' },
  { name: 'Hazard Battlesuits', slot: 'Fast Attack' },
  { name: 'Kroot Hounds', slot: 'Fast Attack' },
  { name: 'Kroot Trackers', slot: 'Fast Attack' },
  { name: 'Kroot Vultures', slot: 'Fast Attack' },
  { name: 'Krootox Rampagers', slot: 'Fast Attack' },
  { name: 'Pathfinder Team', slot: 'Fast Attack' },
  { name: 'Piranha', slot: 'Fast Attack' },
  { name: "R'varna Battlesuit", slot: 'Fast Attack' },
  { name: 'Remora Stealth Drones', slot: 'Fast Attack' },
  { name: 'Tetras', slot: 'Fast Attack' },
  { name: 'Vespid Stingwings', slot: 'Fast Attack' },
  { name: "Y'vahra Battlesuit", slot: 'Fast Attack' },

  // --- Heavy Support (5) ---
  { name: 'Broadside Battlesuits', slot: 'Heavy Support' },
  { name: 'Hammerhead Gunship', slot: 'Heavy Support' },
  { name: 'Krootox Riders', slot: 'Heavy Support' },
  { name: 'Riptide Battlesuit', slot: 'Heavy Support' },
  { name: 'Sky Ray Gunship', slot: 'Heavy Support' },

  // --- Dedicated Transport (1) ---
  { name: 'Devilfish', slot: 'Dedicated Transport' },

  // --- Fortifications (3) ---
  { name: 'Tidewall Droneport', slot: 'Fortifications' },
  { name: 'Tidewall Gunrig', slot: 'Fortifications' },
  { name: 'Tidewall Shieldline', slot: 'Fortifications' },

  // --- Flyers (3) ---
  { name: 'Barracuda Air Superiority Fighter', slot: 'Flyers' },
  { name: 'Razorshark Strike Fighter', slot: 'Flyers' },
  { name: 'Sun Shark Bomber', slot: 'Flyers' },
];
