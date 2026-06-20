/**
 * SUPPORT WEAPONS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const supportWeapons: Unit = {
  "name": "Support Weapons",
  "models": [
    {
      "name": "Support Weapon",
      "points": 54,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "6",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Shadow weaver; Shuriken catapult.",
  "weapons": [
    {
      "name": "D-cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Deadly(5+), Explosive, Graviton"
    },
    {
      "name": "Shadow weaver",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Armor piercing(5+), Explosive, Indirect fire, Monofilament, Suppression"
    },
    {
      "name": "Shuriken catapult",
      "range": "18\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Vibro cannon",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "Haywire, Seeking, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Every model can swap their Shadow weaver",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Vibro cannon",
          "points": 16
        },
        {
          "name": "D-cannon",
          "points": 82
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Shadow weaver"]
    }
  ],
  "abilities": [
    "Battle Focus",
    "Support Weapons crew: Every instance of damage can only ever cause 1 wound loss. Attacks with the \"Barrage\" or \"Explosive\" ability cause one hit for each Wound remaining on the model.",
    "Vibro: If more than one Vibro cannon is shooting at the same target, the weapon gets the \"Decimate\" ability."
  ],
  "unit_type": "Infantry",
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
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 54
};
