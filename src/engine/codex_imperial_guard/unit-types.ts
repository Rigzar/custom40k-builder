/**
 * codex_imperial_guard/unit-types — category 2 of 5 in the codex.ts data model (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as IG_SLOTS (from
 * `units.json`). Migrated from `rules-model/imperial_guard.md` §1.
 *
 * Two entries carry PARSER ARTIFACTS in their production `unit_type` (digest §6.2,
 * `ki-unittype-residuals-01` family) — recorded here verbatim-as-production with the clean value
 * noted in a comment; NOT silently corrected (cosmetic fix scoped separately so the catalogue
 * stays a faithful mirror of production until that data fix lands):
 *   - Ratlings: ability sentence "Battlemutt: ..." leaked into the type → should be "Infantry"
 *   - Engineseer: parenthetical "(Engineseer only)" leaked in → should be "Character Model, Infantry"
 *
 * No option-driven `set_unit_type` mutations: the few multi-type units (Atlas, Crusaders,
 * Destroyer Tank Hunter, Sentinels) carry static composite types; "Mechanical steed" / "Grav-chute"
 * armory options grant ability/stat GRANTS, not type replacement (same Jump-pack-RULE-vs-TYPE
 * distinction documented in [[project_sm_digest]] §Fase 2).
 */

export interface IgUnitTypeEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Static datasheet unit_type, verbatim from production (comma-separated where multiple) */
  unit_type: string;
}

// Source: data/parsed/imperial_guard/units.json `units[name].unit_type` (production, canonical).
export const IG_UNIT_TYPES: IgUnitTypeEntry[] = [
  // HQ
  { name: 'Captain', unit_type: 'Character Model, Infantry' },
  { name: 'Leman Russ Tank Commander', unit_type: 'Vehicle' },
  { name: 'Lord Commissar', unit_type: 'Character Model, Infantry' },
  { name: 'Primaris Psyker', unit_type: 'Character Model, Infantry' },
  { name: 'Salamander Command', unit_type: 'Vehicle' },
  // Troops
  { name: 'Conscript Infantry Platoon', unit_type: 'Infantry' },
  { name: 'Hive Gangers', unit_type: 'Infantry' },
  { name: 'Infantry Squad', unit_type: 'Infantry' },
  { name: 'Mechanised Infantry', unit_type: 'Infantry' },
  { name: 'Penal Legion Squad', unit_type: 'Infantry' },
  { name: 'Platoon Command Squad', unit_type: 'Infantry' },
  // Elites
  { name: 'Astropath', unit_type: 'Character Model, Infantry' },
  { name: 'Atlas Recovery Vehicle', unit_type: 'Vehicle, Character Model, Infantry' },
  { name: 'Bullgryns', unit_type: 'Infantry' },
  { name: 'Commissar', unit_type: 'Character Model, Infantry' },
  { name: 'Company Command Squad', unit_type: 'Infantry' },
  { name: 'Crusaders', unit_type: 'Character Model, Infantry, Squadron' },
  // PARSER ARTIFACT — should be 'Character Model, Infantry' (see header)
  { name: 'Engineseer', unit_type: 'Character Model (Engineseer only), Infantry' },
  { name: 'Leman Russ Commissar', unit_type: 'Vehicle' },
  { name: 'Master of Ordnance', unit_type: 'Character Model, Infantry' },
  { name: 'Officer of the Fleet', unit_type: 'Character Model, Infantry' },
  { name: 'Ogryn Bodyguard', unit_type: 'Character Model, Infantry' },
  { name: 'Ogryn Brutes', unit_type: 'Infantry' },
  { name: 'Ogryns', unit_type: 'Infantry' },
  { name: 'Preacher', unit_type: 'Character Model, Infantry' },
  // PARSER ARTIFACT — should be 'Infantry' (see header)
  { name: 'Ratlings', unit_type: 'Infantry, Battlemutt: Once per game, the unit can perform a Defensive reaction, even if it has already used its order in that combat round.' },
  { name: 'Sanctioned Psykers', unit_type: 'Infantry' },
  { name: 'Special Weapon Squad', unit_type: 'Infantry' },
  { name: 'Stormtrooper Command Squad', unit_type: 'Infantry' },
  { name: 'Stormtroopers', unit_type: 'Infantry' },
  { name: 'Veterans', unit_type: 'Infantry' },
  // Fast Attack
  { name: 'Armoured Sentinels', unit_type: 'Vehicle, Walker' },
  { name: 'Combat Engineers', unit_type: 'Infantry' },
  { name: 'Hellhounds', unit_type: 'Vehicle' },
  { name: 'Rough Riders', unit_type: 'Bike' },
  { name: 'Salamander Scout', unit_type: 'Vehicle' },
  { name: 'Sentinel', unit_type: 'Vehicle, Walker' },
  { name: 'Tauros', unit_type: 'Vehicle' },
  // Heavy Support
  { name: 'Basilisk', unit_type: 'Vehicle' },
  { name: 'Carnodon', unit_type: 'Vehicle' },
  { name: 'Colossus Bombard', unit_type: 'Vehicle' },
  { name: 'Deathstrike Missile Launcher', unit_type: 'Vehicle' },
  { name: 'Destroyer Tank Hunter', unit_type: 'Squadron, Vehicle' },
  { name: 'Field Ordnance Battery', unit_type: 'Infantry' },
  { name: 'Griffon', unit_type: 'Vehicle' },
  { name: 'Heavy Ordnance Carriage', unit_type: 'Infantry' },
  { name: 'Heavy Weapon Squad', unit_type: 'Infantry' },
  { name: 'Hydra', unit_type: 'Vehicle' },
  { name: 'Leman Russ', unit_type: 'Vehicle' },
  { name: 'Malcador', unit_type: 'Vehicle' },
  { name: 'Manticore', unit_type: 'Vehicle' },
  { name: 'Medusa', unit_type: 'Vehicle' },
  { name: 'Rogal Dorn', unit_type: 'Vehicle' },
  { name: 'Wyvern', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Centaur Carrier', unit_type: 'Vehicle' },
  { name: 'Chimera', unit_type: 'Vehicle' },
  { name: 'Taurox', unit_type: 'Vehicle' },
  { name: 'Trojan', unit_type: 'Vehicle' },
  { name: 'Valkyrie', unit_type: 'Flyer, Vehicle' },
  // Flyers
  { name: 'Vendetta', unit_type: 'Flyer, Vehicle' },
];
