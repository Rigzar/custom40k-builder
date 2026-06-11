/**
 * codex_necrons/unit-types — category 2 of 5 (Unit type).
 *
 * Static datasheet `unit_type` per unit, extracted in the SAME pass as NECRON_SLOTS. Migrated from
 * `rules-model/necrons.md` §1. NOTE: the Necron / Canoptek / Cryptek / Lord sub-types are embedded
 * in the `unit_type` string (NOT in `keywords[]` — see keywords.ts), same encoding as Tau's Kroot.
 * No parser artifacts. The "Skorpekh body"/"Destroyer body"/"Veil of darkness" armory options
 * modify the model but are not recorded as static `set_unit_type` here.
 */

export interface NecronUnitTypeEntry {
  name: string;
  unit_type: string;
}

// Source: data/parsed/necrons/units.json `units[name].unit_type` (production canonical).
export const NECRON_UNIT_TYPES: NecronUnitTypeEntry[] = [
  // HQ
  { name: 'Ancient Destructor Lord', unit_type: 'Jump Pack, Monstrous Creature, Lord, Necron' },
  { name: 'Cryptek', unit_type: 'Character Model, Infantry, Cryptek, Necron' },
  { name: 'Lord', unit_type: 'Character Model, Infantry, Lord, Necron' },
  { name: 'Royal Warden', unit_type: 'Character Model, Infantry, Necron' },
  { name: 'Skorpekh Lord', unit_type: 'Character Model, Monstrous Creature, Lord, Necron' },
  // Troops
  { name: 'Flayed Ones', unit_type: 'Infantry, Necron' },
  { name: 'Immortals', unit_type: 'Infantry, Necron' },
  { name: 'Warriors', unit_type: 'Infantry, Necron' },
  // Elites
  { name: "C'tan Shard", unit_type: 'Monstrous Creature' },
  { name: "C'tan Shard of the Deceiver", unit_type: 'Monstrous Creature' },
  { name: "C'tan Shard of the Dragon", unit_type: 'Monstrous Creature' },
  { name: "C'tan Shard of the Nightbringer", unit_type: 'Monstrous Creature' },
  { name: 'Canoptek Reanimator', unit_type: 'Walker, Canoptek' },
  { name: 'Canoptek Spyders', unit_type: 'Monstrous Creature, Canoptek' },
  { name: 'Cryptothralls', unit_type: 'Infantry' },
  { name: 'Deathmarks', unit_type: 'Infantry, Necron' },
  { name: 'Hexmark Destroyer', unit_type: 'Character Model, Infantry, Necron' },
  { name: 'Lychguard', unit_type: 'Infantry, Necron' },
  { name: 'Pariahs', unit_type: 'Infantry' },
  { name: 'Plasmacyte', unit_type: 'Infantry' },
  { name: 'Skorpekh Destroyers', unit_type: 'Infantry, Necron' },
  { name: 'Triarch Stalker', unit_type: 'Walker' },
  // Fast Attack
  { name: 'Canoptek Scarabs', unit_type: 'Jet Bike, Canoptek' },
  { name: 'Canoptek Wraiths', unit_type: 'Jet Bike, Monstrous Infantry, Canoptek' },
  { name: 'Ophydian Destroyers', unit_type: 'Jump Pack Infantry, Necron' },
  { name: 'Tomb Blades', unit_type: 'Jet Bike, Necron' },
  { name: 'Triarch Praetorians', unit_type: 'Jump Pack Infantry, Necron' },
  // Heavy Support
  { name: 'Annihilation Barge', unit_type: 'Vehicle' },
  { name: 'Canoptek Doomstalker', unit_type: 'Squadron, Walker, Canoptek' },
  { name: 'Doomsday Ark', unit_type: 'Vehicle' },
  { name: 'Lokhust Destroyers', unit_type: 'Jet Bike, Necron' },
  { name: 'Monolith', unit_type: 'Vehicle' },
  // Dedicated Transport
  { name: 'Ghost Ark', unit_type: 'Vehicle' },
  { name: 'Catacomb Command Barge', unit_type: 'Vehicle' },
  // Fortifications
  { name: 'Convergence of Dominion', unit_type: 'Vehicle' },
  // Flyers
  { name: 'Doom Scythe', unit_type: 'Flyer' },
  { name: 'Night Scythe', unit_type: 'Flyer' },
];
