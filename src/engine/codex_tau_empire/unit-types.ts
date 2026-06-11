/**
 * codex_tau_empire/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as TAU_SLOTS. Migrated from
 * `rules-model/tau_empire.md` §1. NOTE: ~9 Kroot units carry "Kroot" inside the `unit_type` string
 * (the Kroot sub-faction is encoded here, NOT in `keywords[]` — see keywords.ts). One composite
 * carries a parenthetical ("Bike (Kroot hounds only), Infantry, Kroot") — recorded verbatim. The
 * "Wings"/"XV86 Coldstar"/etc. armory options change the suit type but are not recorded as static
 * `set_unit_type` here.
 */

export interface TauUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/tau_empire/units.json `units[name].unit_type` (production canonical).
export const TAU_UNIT_TYPES: TauUnitTypeEntry[] = [
  // HQ
  { name: 'Commander', unit_type: 'Jump pack, Monstrous Infantry' },
  { name: 'Ethereal', unit_type: 'Character Model, Infantry' },
  { name: 'Ethereal Guard', unit_type: 'Infantry' },
  { name: 'Kroot Master Shaper', unit_type: 'Character, Infantry, Kroot' },
  { name: 'Sub-Commander', unit_type: 'Character Model, Infantry' },
  // Troops
  { name: 'Breacher Team', unit_type: 'Infantry' },
  { name: 'Kroot Carnivores', unit_type: 'Infantry, Kroot' },
  { name: 'Strike Team', unit_type: 'Infantry' },
  { name: 'Support Turrets', unit_type: 'Vehicle' },
  // Elites
  { name: 'Crisis Battlesuits', unit_type: 'Jump pack, Monstrous Infantry' },
  { name: 'Crisis Honor Guard', unit_type: 'Jump pack, Monstrous Infantry' },
  { name: 'Ghostkeel Battlesuits', unit_type: 'Jump pack, Monstrous Creature' },
  { name: 'Kroot Farstalkers', unit_type: 'Bike (Kroot hounds only), Infantry, Kroot' },
  { name: 'Kroot Lone-Spear', unit_type: 'Bike, Kroot' },
  { name: 'Kroot Shaper', unit_type: 'Character, Infantry, Kroot' },
  { name: 'Stealth Battlesuits', unit_type: 'Infantry, Jump pack' },
  // Fast Attack
  { name: 'Firesight Marksman', unit_type: 'Infantry' },
  { name: 'Great Knarloc', unit_type: 'Monstrous Creature, Kroot' },
  { name: 'Hazard Battlesuits', unit_type: 'Jump pack, Monstrous Infantry' },
  { name: 'Kroot Hounds', unit_type: 'Bike, Kroot' },
  { name: 'Kroot Trackers', unit_type: 'Bike, Kroot' },
  { name: 'Kroot Vultures', unit_type: 'Jump Pack Infantry, Kroot' },
  { name: 'Krootox Rampagers', unit_type: 'Monstrous Infantry, Kroot' },
  { name: 'Pathfinder Team', unit_type: 'Infantry' },
  { name: 'Piranha', unit_type: 'Vehicle' },
  { name: "R'varna Battlesuit", unit_type: 'Jump pack, Monstrous Creature' },
  { name: 'Remora Stealth Drones', unit_type: 'Jump pack' },
  { name: 'Tetras', unit_type: 'Jetbike' },
  { name: 'Vespid Stingwings', unit_type: 'Jump Pack Infantry' },
  { name: "Y'vahra Battlesuit", unit_type: 'Jump pack, Monstrous Creature' },
  // Heavy Support
  { name: 'Broadside Battlesuits', unit_type: 'Monstrous Infantry' },
  { name: 'Hammerhead Gunship', unit_type: 'Vehicle' },
  { name: 'Krootox Riders', unit_type: 'Monstrous Infantry, Kroot' },
  { name: 'Riptide Battlesuit', unit_type: 'Jump pack, Monstrous Creature' },
  { name: 'Sky Ray Gunship', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Devilfish', unit_type: 'Vehicle' },
  // Fortifications
  { name: 'Tidewall Droneport', unit_type: 'Vehicle' },
  { name: 'Tidewall Gunrig', unit_type: 'Vehicle' },
  { name: 'Tidewall Shieldline', unit_type: 'Vehicle' },
  // Flyers
  { name: 'Barracuda Air Superiority Fighter', unit_type: 'Flyer' },
  { name: 'Razorshark Strike Fighter', unit_type: 'Flyer' },
  { name: 'Sun Shark Bomber', unit_type: 'Flyer' },
];
