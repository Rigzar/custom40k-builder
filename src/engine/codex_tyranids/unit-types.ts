/**
 * codex_tyranids/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as TYRANID_SLOTS. Migrated from
 * `rules-model/tyranids.md` §1. No parser artifacts (the source "Montrous Creature" typo is
 * corrected to "Monstrous Creature" in production). Monster-heavy roster (no vehicles at all). The
 * "Winged" special biomorph can grant Deep Strike/Anti-Grav but does not change the static
 * unit_type recorded here.
 */

export interface TyranidUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/tyranids/units.json `units[name].unit_type` (production canonical).
export const TYRANID_UNIT_TYPES: TyranidUnitTypeEntry[] = [
  // HQ
  { name: 'Hive Tyrant', unit_type: 'Monstrous Creature' },
  { name: 'Malanthrope', unit_type: 'Character Model, Monstrous Infantry' },
  { name: 'Neurotyrant', unit_type: 'Monstrous Creature' },
  { name: 'Swarmlord', unit_type: 'Monstrous Creature' },
  { name: 'Tervigon', unit_type: 'Monstrous Creature' },
  { name: 'Tyranid Prime', unit_type: 'Character Model, Infantry' },
  { name: 'Tyrant Guard Brood', unit_type: 'Infantry' },
  // Troops
  { name: 'Barbgaunt Brood', unit_type: 'Infantry' },
  { name: 'Genestealer Brood', unit_type: 'Infantry' },
  { name: 'Hormagaunt Brood', unit_type: 'Infantry' },
  { name: 'Neurogaunt Brood', unit_type: 'Infantry' },
  { name: 'Ripper Swarms', unit_type: 'Infantry' },
  { name: 'Termagant Brood', unit_type: 'Infantry' },
  { name: 'Tyranid Warrior Brood', unit_type: 'Infantry' },
  // Elites
  { name: 'Deathleaper', unit_type: 'Monstrous Infantry' },
  { name: 'Haruspex', unit_type: 'Monstrous Creature' },
  { name: 'Hive Guard Brood', unit_type: 'Infantry' },
  { name: 'Lictor Brood', unit_type: 'Monstrous Infantry' },
  { name: 'Maleceptor', unit_type: 'Monstrous Creature' },
  { name: 'Toxicrene', unit_type: 'Monstrous Creature' },
  { name: 'Venomthrope Brood', unit_type: 'Monstrous Infantry' },
  { name: "Von Ryan's Leaper Brood", unit_type: 'Infantry' },
  { name: 'Zoanthrope Brood', unit_type: 'Infantry' },
  // Fast Attack
  { name: 'Gargoyle Brood', unit_type: 'Jump Pack Infantry' },
  { name: 'Mawloc', unit_type: 'Monstrous Creature' },
  { name: 'Mucolid Spore Cluster', unit_type: 'Jump Pack Infantry' },
  { name: 'Parasite of Mortrex', unit_type: 'Jump Pack Infantry' },
  { name: 'Psychophage', unit_type: 'Monstrous Creature' },
  { name: 'Pyrovore Brood', unit_type: 'Infantry' },
  { name: 'Ravener Brood', unit_type: 'Bike' },
  { name: 'Spore Mine Cluster', unit_type: 'Infantry' },
  { name: 'Trygon', unit_type: 'Monstrous Creature' },
  // Heavy Support
  { name: 'Biovore Brood', unit_type: 'Infantry' },
  { name: 'Carnifex Brood', unit_type: 'Monstrous Creature' },
  { name: 'Exocrine', unit_type: 'Monstrous Creature' },
  { name: 'Norn', unit_type: 'Monstrous Creature' },
  { name: 'Tyrannofex', unit_type: 'Monstrous Creature' },
  // Dedicated Transport
  { name: 'Tyrannocyte', unit_type: 'Monstrous Creature' },
  // Fortifications
  { name: 'Sporecyst', unit_type: 'Monstrous Creature' },
  // Flyers
  { name: 'Harpy', unit_type: 'Flyer, Monstrous Creature' },
];
