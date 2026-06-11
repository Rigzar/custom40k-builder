/**
 * codex_dark_eldar/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as DARK_ELDAR_SLOTS. Migrated
 * from `rules-model/dark_eldar.md` §1. No parser artifacts in the types. No option-driven
 * `set_unit_type` (Hellions/Scourges are statically Jump Pack Infantry; Reavers statically
 * Jetbike; the Skybike/Skyboard armory options grant the Jetbike/Jump-pack RULE as stat grants).
 * ("Furious Charge" phantom slot entry has no datasheet → excluded, see slots.ts header.)
 */

export interface DarkEldarUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/dark_eldar/units.json `units[name].unit_type` (production canonical).
export const DARK_ELDAR_UNIT_TYPES: DarkEldarUnitTypeEntry[] = [
  // HQ
  { name: 'Dracon', unit_type: 'Character Model, Infantry' },
  { name: 'Haemonculus', unit_type: 'Character Model, Infantry' },
  { name: 'Succubus', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Kabalite Warriors', unit_type: 'Infantry' },
  { name: 'Wracks', unit_type: 'Infantry' },
  { name: 'Wyches', unit_type: 'Infantry' },
  // Elites
  { name: 'Grotesques', unit_type: 'Infantry' },
  { name: 'Incubi', unit_type: 'Infantry' },
  { name: 'Mandrakes', unit_type: 'Infantry' },
  // Fast Attack
  { name: 'Hellions', unit_type: 'Jump Pack Infantry' },
  { name: 'Reavers', unit_type: 'Jetbike' },
  { name: 'Scourges', unit_type: 'Jump Pack Infantry' },
  // Heavy Support
  { name: 'Cronos', unit_type: 'Monstrous Creature' },
  { name: 'Ravager', unit_type: 'Vehicle' },
  { name: 'Talos', unit_type: 'Monstrous Creature' },
  // Dedicated Transport
  { name: 'Raider', unit_type: 'Vehicle' },
  { name: 'Venom', unit_type: 'Vehicle' },
  // Flyers
  { name: 'Razorwing Jetfighter', unit_type: 'Flyer' },
  { name: 'Voidraven Bomber', unit_type: 'Flyer' },
];
