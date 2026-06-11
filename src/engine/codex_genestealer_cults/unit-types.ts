/**
 * codex_genestealer_cults/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as GSC_SLOTS. Migrated from
 * `rules-model/genestealer_cults.md` §1. No parser artifacts. No option-driven `set_unit_type` (the
 * "Atalan bike"/"Pervasion veil" armory options grant the Bike type / Jump-pack rule on infantry).
 * GSC is very character-heavy (11 of 20 units are "Character Model, Infantry").
 */

export interface GscUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/genestealer_cults/units.json `units[name].unit_type` (production canonical).
export const GSC_UNIT_TYPES: GscUnitTypeEntry[] = [
  // HQ
  { name: 'Acolyte Iconward', unit_type: 'Character Model, Infantry' },
  { name: 'Magus', unit_type: 'Character Model, Infantry' },
  { name: 'Patriarch', unit_type: 'Character Model, Infantry' },
  { name: 'Primus', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Acolyte Hybrids', unit_type: 'Infantry' },
  { name: 'Neophyte Hybrids', unit_type: 'Infantry' },
  // Elites
  { name: 'Abberants', unit_type: 'Monstrous Infantry' },
  { name: 'Abominant', unit_type: 'Character Model, Monstrous Infantry' },
  { name: 'Biophagus', unit_type: 'Character Model, Infantry' },
  { name: 'Clamavus', unit_type: 'Character Model, Infantry' },
  { name: 'Nexos', unit_type: 'Character Model, Infantry' },
  { name: 'Purestrain Genestealers', unit_type: 'Infantry' },
  { name: 'Reductus Saboteur', unit_type: 'Character Model, Infantry' },
  { name: 'Sanctus', unit_type: 'Character Model, Infantry' },
  { name: 'Kelermorph', unit_type: 'Character Model, Infantry' },
  { name: 'Locus', unit_type: 'Character Model, Infantry' },
  // Fast Attack
  { name: 'Achilles Ridgerunners', unit_type: 'Vehicle' },
  { name: 'Atalan Jackals', unit_type: 'Bike' },
  // Heavy Support
  { name: 'Goliath Rockgrinder', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Goliath Truck', unit_type: 'Vehicle' },
];
