/**
 * codex_adeptus_custodes/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as CUSTODES_SLOTS. Migrated
 * from `rules-model/adeptus_custodes.md` §1. No parser artifacts. No option-driven `set_unit_type`.
 * (The "Vigilators" phantom slot entry has no datasheet → excluded, see slots.ts header.)
 */

export interface CustodesUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/adeptus_custodes/units.json `units[name].unit_type` (production canonical).
export const CUSTODES_UNIT_TYPES: CustodesUnitTypeEntry[] = [
  // HQ
  { name: 'Blade Champion', unit_type: 'Character Model, Infantry' },
  { name: 'Knight-Centura', unit_type: 'Character Model, Infantry' },
  { name: 'Shield-Captain', unit_type: 'Character Model, Infantry' },
  { name: 'Shield-Captain on Jetbike', unit_type: 'Character Model, Jetbike' },
  // Troops
  { name: 'Custodian Guard', unit_type: 'Infantry' },
  { name: 'Sagittarum Custodians', unit_type: 'Infantry' },
  { name: 'Sisters of Silence', unit_type: 'Infantry' },
  // Elites
  { name: 'Allarus Custodians', unit_type: 'Infantry' },
  { name: 'Aquilon Custodians', unit_type: 'Infantry' },
  { name: 'Galatus Contemptor Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Custodian Wardens', unit_type: 'Infantry' },
  { name: 'Venerable Contemptor Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Vertus Praetor', unit_type: 'Jetbike' },
  // Fast Attack
  { name: 'Jetbike Custodians', unit_type: 'Jetbike' },
  // Heavy Support
  { name: 'Caladius Grav-Tank', unit_type: 'Vehicle' },
  { name: 'Telemon Heavy Dreadnought', unit_type: 'Vehicle, Walker' },
  { name: 'Venerable Land Raider', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Rhino', unit_type: 'Vehicle' },
  { name: 'Coronus Grav-carrier', unit_type: 'Vehicle' },
];
