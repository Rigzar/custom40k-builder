/**
 * CASTIGATOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const castigator: Unit = {
  "name": "Castigator",
  "models": [
    {
      "name": "Castigator",
      "points": 339,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "11",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Castigator is equipped with: Castigator autocannon; 3 Heavy bolters.",
  "weapons": [
    {
      "name": "Castigator autocannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1)"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Castigator battle cannon - Pyre shell",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Seeking"
    },
    {
      "name": "Castigator battle cannon - Sanctified shell",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Castigator autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Castigator battle cannon",
          "points": 45
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with an additional Storm bolter for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Acts of Faith, Shield of Faith"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "min_cost": 339
};
