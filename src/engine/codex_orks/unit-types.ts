/**
 * codex_orks/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as ORK_SLOTS. Migrated from
 * `rules-model/orks.md` §1. No parser artifacts. No option-driven `set_unit_type` recorded here
 * (the Squighog steed / Squigosaur / Waaagh!-Bike / Rocket pack armory options grant Bike/Jump-pack
 * types as stat grants on infantry — RULE-vs-TYPE per [[project_sm_digest]]).
 */

export interface OrkUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/orks/units.json `units[name].unit_type` (production canonical).
export const ORK_UNIT_TYPES: OrkUnitTypeEntry[] = [
  // HQ
  { name: 'Big Mek', unit_type: 'Character Model, Infantry' },
  { name: 'Boss', unit_type: 'Character Model, Infantry' },
  { name: 'Dok', unit_type: 'Character Model, Infantry' },
  { name: 'Weirdboy', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Beast Snagga Boyz', unit_type: 'Infantry' },
  { name: 'Boyz', unit_type: 'Infantry' },
  { name: 'Gretchins', unit_type: 'Infantry' },
  { name: 'Skarboyz', unit_type: 'Infantry' },
  { name: 'Snotlings', unit_type: 'Infantry' },
  // Elites
  { name: 'Burna Boyz', unit_type: 'Infantry' },
  { name: 'Cybork Slashaz', unit_type: 'Infantry' },
  { name: 'Kommandos', unit_type: 'Infantry' },
  { name: 'Mekboy', unit_type: 'Character Model, Infantry' },
  { name: 'Mekboy Junka', unit_type: 'Vehicle' },
  { name: 'Nobz', unit_type: 'Infantry' },
  { name: 'Painboy', unit_type: 'Character Model, Infantry' },
  { name: 'Tankbustas', unit_type: 'Infantry' },
  // Fast Attack
  { name: 'Deffkoptaz', unit_type: 'Jetbike' },
  { name: 'Grot Tanks', unit_type: 'Vehicle' },
  { name: 'Squighog Boyz', unit_type: 'Bike' },
  { name: 'Stormboyz', unit_type: 'Jump Pack Infantry' },
  { name: 'Warbikers', unit_type: 'Bike' },
  { name: 'Warbuggy', unit_type: 'Vehicle' },
  { name: 'Warkopta', unit_type: 'Vehicle' },
  // Heavy Support
  { name: 'Battle Fortress', unit_type: 'Super-heavy Vehicle' },
  { name: 'Battlewagon', unit_type: 'Vehicle' },
  { name: 'Deff Dreads', unit_type: 'Walker' },
  { name: 'Flash Gits', unit_type: 'Infantry' },
  { name: 'Hunta Rig', unit_type: 'Vehicle' },
  { name: 'Killa Kans', unit_type: 'Walker' },
  { name: 'Killa Rig', unit_type: 'Vehicle' },
  { name: 'Lootas', unit_type: 'Infantry' },
  { name: 'Mek Gunz', unit_type: 'Infantry' },
  { name: 'Wagon', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Kan', unit_type: 'Vehicle' },
  { name: 'Looted Valkyrie', unit_type: 'Flyer' },
  { name: 'Squiggoth', unit_type: 'Monstrous Creature' },
  { name: 'Trukk', unit_type: 'Vehicle' },
  // Fortifications
  { name: "Big'ed Bossbunka", unit_type: 'Vehicle' },
  // Flyers
  { name: 'Fighta-Bommer', unit_type: 'Flyer' },
  { name: 'Wazbom Blastajet', unit_type: 'Flyer' },
];
