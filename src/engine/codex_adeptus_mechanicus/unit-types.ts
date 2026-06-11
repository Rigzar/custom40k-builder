/**
 * codex_adeptus_mechanicus/unit-types — category 2 of 5 in the codex.ts data model (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as ADMECH_SLOTS (from
 * units.json). Migrated from `rules-model/adeptus_mechanicus.md` §1. No parser-artifact values
 * (cleaner than IG). No option-driven `set_unit_type`: Pteraxii are statically `Jump Pack
 * Infantry`; the "Pteraxii wings"/"Serberys steed" armory options grant the Jump-pack RULE / Bike
 * type as ability+stat GRANTS on infantry (same RULE-vs-TYPE distinction as [[project_sm_digest]]).
 */

export interface AdMechUnitTypeEntry {
  /** Unit name as it appears in production data / canonical text */
  name: string;
  /** Static datasheet unit_type, verbatim from production */
  unit_type: string;
}

// Source: data/parsed/adeptus_mechanicus/units.json `units[name].unit_type` (production canonical).
export const ADMECH_UNIT_TYPES: AdMechUnitTypeEntry[] = [
  // HQ
  { name: 'Magos', unit_type: 'Character Model, Infantry' },
  { name: 'Skitarii Marshal', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Skitarii Rangers', unit_type: 'Infantry' },
  { name: 'Skitarii Vanguard', unit_type: 'Infantry' },
  { name: 'Tech Thralls', unit_type: 'Infantry' },
  // Elites
  { name: 'Corpuscarii Electro-Priests', unit_type: 'Infantry' },
  { name: 'Fulgurite Electro-Priests', unit_type: 'Infantry' },
  { name: 'Kataphron Breachers', unit_type: 'Infantry' },
  { name: 'Kataphron Destroyers', unit_type: 'Infantry' },
  { name: 'Secutarii Hoplites', unit_type: 'Infantry' },
  { name: 'Secutarii Peltasts', unit_type: 'Infantry' },
  { name: 'Servitors', unit_type: 'Infantry' },
  { name: 'Sicaran Infiltrators', unit_type: 'Infantry' },
  { name: 'Sicaran Ruststalkers', unit_type: 'Infantry' },
  { name: 'Sydonian Skatros', unit_type: 'Infantry' },
  { name: 'Tech-Priest', unit_type: 'Character Model, Infantry' },
  // Fast Attack
  { name: 'Pteraxii Skystalkers', unit_type: 'Jump Pack Infantry' },
  { name: 'Pteraxii Sterylizors', unit_type: 'Jump Pack Infantry' },
  { name: 'Serberys Raiders', unit_type: 'Bike' },
  { name: 'Serberys Sulphurhounds', unit_type: 'Bike' },
  { name: 'Sydonian Dragoons', unit_type: 'Bike, Monstrous Creature' },
  // Heavy Support
  { name: 'Ironstrider Ballistarii', unit_type: 'Bike, Monstrous Creature' },
  { name: 'Kastelan Robots', unit_type: 'Monstrous Infantry' },
  { name: 'Macrocarid Explorator', unit_type: 'Vehicle' },
  { name: 'Onager Dunecrawler', unit_type: 'Vehicle' },
  { name: 'Skorpius Disintegrator', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Skorpius Dunerider', unit_type: 'Vehicle' },
  { name: 'Termite', unit_type: 'Vehicle' },
  // Flyers
  { name: 'Archaeopter', unit_type: 'Flyer, Vehicle' },
];
