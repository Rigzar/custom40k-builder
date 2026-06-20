/**
 * VENERABLE LAND RAIDER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const venerableLandRaider: Unit = {
  "name": "Venerable Land Raider",
  "models": [
    {
      "name": "Land Raider",
      "points": 542,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "2+",
        "S": "7",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "4",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Land Raider is a single model and equipped with: 2 Twin lascannon; Twin heavy bolter.",
  "weapons": [
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with a Storm bolter for +13 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 13,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with a Multi-melter for +46 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 46,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Shield Host",
    "Assault ramp: Passengers can still make a 6\" charge move after the vehicle moves and they exit.",
    "Custodes Atomantic Shielding: The model has a 5+ invulnerability save. Enemy attacks receive a -1 AT penalty (to a minimum of 1).",
    "Transport: This model has a transport capacity of 10 infantry models."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 542
};
