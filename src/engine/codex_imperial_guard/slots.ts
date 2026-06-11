/**
 * codex_imperial_guard/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted programmatically from `data/parsed/imperial_guard/units.json`
 * (`slot_to_units` index + `units` object keyed by name — IG uses a single units.json, NOT
 * per-slot TS files like CSM/GK). Migrated from `rules-model/imperial_guard.md` — digest built
 * from the `.ods` canon 2026-06-11.
 *
 * 60 units / 7 populated slots (Fortifications = 0) — SIXTH faction migrated, after CSM (pilot)
 * + Chaos Daemons + Space Marines + Inquisition + Grey Knights. IG's largest-roster migration so
 * far (60 vs GK 22, SM 74... — actually 2nd-largest after SM).
 */

export interface IgSlotEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Slot this unit occupies */
  slot: 'HQ' | 'Troops' | 'Elites' | 'Fast Attack' | 'Heavy Support' | 'Dedicated Transport' | 'Flyers';
}

// Source: data/parsed/imperial_guard/units.json `slot_to_units` (production, canonical).
export const IG_SLOTS: IgSlotEntry[] = [
  // --- HQ (5) ---
  { name: 'Captain', slot: 'HQ' },
  { name: 'Leman Russ Tank Commander', slot: 'HQ' },
  { name: 'Lord Commissar', slot: 'HQ' },
  { name: 'Primaris Psyker', slot: 'HQ' },
  { name: 'Salamander Command', slot: 'HQ' },

  // --- Troops (6) ---
  { name: 'Conscript Infantry Platoon', slot: 'Troops' },
  { name: 'Hive Gangers', slot: 'Troops' },
  { name: 'Infantry Squad', slot: 'Troops' },
  { name: 'Mechanised Infantry', slot: 'Troops' },
  { name: 'Penal Legion Squad', slot: 'Troops' },
  { name: 'Platoon Command Squad', slot: 'Troops' },

  // --- Elites (20) ---
  { name: 'Astropath', slot: 'Elites' },
  { name: 'Atlas Recovery Vehicle', slot: 'Elites' },
  { name: 'Bullgryns', slot: 'Elites' },
  { name: 'Commissar', slot: 'Elites' },
  { name: 'Company Command Squad', slot: 'Elites' },
  { name: 'Crusaders', slot: 'Elites' },
  { name: 'Engineseer', slot: 'Elites' },
  { name: 'Leman Russ Commissar', slot: 'Elites' },
  { name: 'Master of Ordnance', slot: 'Elites' },
  { name: 'Officer of the Fleet', slot: 'Elites' },
  { name: 'Ogryn Bodyguard', slot: 'Elites' },
  { name: 'Ogryn Brutes', slot: 'Elites' },
  { name: 'Ogryns', slot: 'Elites' },
  { name: 'Preacher', slot: 'Elites' },
  { name: 'Ratlings', slot: 'Elites' },
  { name: 'Sanctioned Psykers', slot: 'Elites' },
  { name: 'Special Weapon Squad', slot: 'Elites' },
  { name: 'Stormtrooper Command Squad', slot: 'Elites' },
  { name: 'Stormtroopers', slot: 'Elites' },
  { name: 'Veterans', slot: 'Elites' },

  // --- Fast Attack (7) ---
  { name: 'Armoured Sentinels', slot: 'Fast Attack' },
  { name: 'Combat Engineers', slot: 'Fast Attack' },
  { name: 'Hellhounds', slot: 'Fast Attack' },
  { name: 'Rough Riders', slot: 'Fast Attack' },
  { name: 'Salamander Scout', slot: 'Fast Attack' },
  { name: 'Sentinel', slot: 'Fast Attack' },
  { name: 'Tauros', slot: 'Fast Attack' },

  // --- Heavy Support (16) ---
  { name: 'Basilisk', slot: 'Heavy Support' },
  { name: 'Carnodon', slot: 'Heavy Support' },
  { name: 'Colossus Bombard', slot: 'Heavy Support' },
  { name: 'Deathstrike Missile Launcher', slot: 'Heavy Support' },
  { name: 'Destroyer Tank Hunter', slot: 'Heavy Support' },
  { name: 'Field Ordnance Battery', slot: 'Heavy Support' },
  { name: 'Griffon', slot: 'Heavy Support' },
  { name: 'Heavy Ordnance Carriage', slot: 'Heavy Support' },
  { name: 'Heavy Weapon Squad', slot: 'Heavy Support' },
  { name: 'Hydra', slot: 'Heavy Support' },
  { name: 'Leman Russ', slot: 'Heavy Support' },
  { name: 'Malcador', slot: 'Heavy Support' },
  { name: 'Manticore', slot: 'Heavy Support' },
  { name: 'Medusa', slot: 'Heavy Support' },
  { name: 'Rogal Dorn', slot: 'Heavy Support' },
  { name: 'Wyvern', slot: 'Heavy Support' },

  // --- Dedicated Transport (5) ---
  { name: 'Centaur Carrier', slot: 'Dedicated Transport' },
  { name: 'Chimera', slot: 'Dedicated Transport' },
  { name: 'Taurox', slot: 'Dedicated Transport' },
  { name: 'Trojan', slot: 'Dedicated Transport' },
  { name: 'Valkyrie', slot: 'Dedicated Transport' },

  // --- Flyers (1) ---
  { name: 'Vendetta', slot: 'Flyers' },
];
