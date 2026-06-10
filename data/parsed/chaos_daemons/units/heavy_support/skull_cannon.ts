/**
 * SKULL CANNON — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skullCannon: Unit = {
  "name": "Skull Cannon",
  "models": [
    {
      "name": "Skull Cannon",
      "points": 96,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "6",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Skull Cannon is equipped with: Hellblade; Skull Cannon.",
  "weapons": [
    {
      "name": "Hellblade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+)"
    },
    {
      "name": "Skull Cannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Barrage, Suppression"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep strike, Daemon, Daemonic instability, Mark of Khorne, Terrifying(-1)"
  ],
  "unit_type": "Bike",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 96
};
