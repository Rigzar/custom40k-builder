/**
 * codex_eldar/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as ELDAR_SLOTS. Migrated from
 * `rules-model/eldar.md` §1. ONE parser artifact: "Swooping Hawks" carries `unit_type: "Jump pack"`
 * (should be "Jump Pack Infantry") — recorded verbatim-as-production with a comment, NOT silently
 * corrected (cosmetic fix scoped separately, `ki-unittype-residuals-01` family). No option-driven
 * `set_unit_type`.
 */

export interface EldarUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/eldar/units.json `units[name].unit_type` (production canonical).
export const ELDAR_UNIT_TYPES: EldarUnitTypeEntry[] = [
  // HQ
  { name: 'Autarch', unit_type: 'Character Model, Infantry' },
  { name: 'Avatar of Khaine', unit_type: 'Monstrous Creature' },
  { name: 'Farseer', unit_type: 'Character Model, Infantry' },
  { name: 'Spiritseer', unit_type: 'Character Model, Infantry' },
  { name: 'Wraithseer', unit_type: 'Monstrous Creature' },
  { name: 'Yncarne', unit_type: 'Monstrous Creature' },
  // Troops
  { name: 'Corsair Voidreavers', unit_type: 'Infantry' },
  { name: 'Guardian Defenders', unit_type: 'Infantry' },
  { name: 'Rangers', unit_type: 'Infantry' },
  { name: 'Storm Guardians', unit_type: 'Infantry' },
  { name: 'Wasps', unit_type: 'Walker' },
  // Elites
  { name: 'Corsair Voidscarred', unit_type: 'Infantry' },
  { name: 'Dire Avengers', unit_type: 'Infantry' },
  { name: 'Fire Dragons', unit_type: 'Infantry' },
  { name: 'Howling Banshees', unit_type: 'Infantry' },
  { name: 'Shadow Spectres', unit_type: 'Jump Pack Infantry' },
  { name: 'Striking Scorpions', unit_type: 'Infantry' },
  { name: 'Warlocks', unit_type: 'Character Model, Infantry' },
  { name: 'Wraithblades', unit_type: 'Monstrous Infantry' },
  { name: 'Wraithguard', unit_type: 'Monstrous Infantry' },
  { name: 'Wraithlord', unit_type: 'Monstrous Creature' },
  // Fast Attack
  { name: 'Hornets', unit_type: 'Vehicle' },
  { name: 'Shining Spears', unit_type: 'Jetbike' },
  { name: 'Shroud Runners', unit_type: 'Jetbike' },
  // PARSER ARTIFACT — should be 'Jump Pack Infantry' (see header)
  { name: 'Swooping Hawks', unit_type: 'Jump pack' },
  { name: 'Vypers', unit_type: 'Vehicle' },
  { name: 'Warp Spiders', unit_type: 'Jump Pack Infantry' },
  { name: 'Windriders', unit_type: 'Jetbike' },
  // Heavy Support
  { name: 'Dark Reapers', unit_type: 'Infantry' },
  { name: 'Falcon', unit_type: 'Vehicle' },
  { name: 'Fire Prism', unit_type: 'Vehicle' },
  { name: 'Night Spinner', unit_type: 'Vehicle' },
  { name: 'Support Weapons', unit_type: 'Infantry' },
  { name: 'War Walkers', unit_type: 'Walker' },
  // Dedicated Transport
  { name: 'Wave Serpent', unit_type: 'Vehicle' },
  // Flyers
  { name: 'Crimson Hunter', unit_type: 'Flyer' },
  { name: 'Nightwing', unit_type: 'Flyer' },
  { name: 'Phoenix', unit_type: 'Flyer' },
];
