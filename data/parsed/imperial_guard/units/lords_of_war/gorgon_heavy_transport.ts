/**
 * GORGON HEAVY TRANSPORT — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const gorgonHeavyTransport: Unit = {
  "name": "Gorgon Heavy Transport",
  "models": [
    {
      "name": "Gorgon Heavy Transport",
      "points": 501,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "8",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Gorgon Heavy Transport is equipped with: 2 Twin heavy stubbers.",
  "weapons": [
    {
      "name": "Gorgon mortar",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
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
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Twin heavy stubber",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with sponsons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "4 Heavy stubbers",
          "points": 45
        },
        {
          "name": "4 Heavy bolters",
          "points": 54
        },
        {
          "name": "4 Heavy flamers",
          "points": 69
        },
        {
          "name": "Gorgon mortar",
          "points": 82
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Heavy armored prow: The model gains a 5+ invulnerability save against ranged attacks from the front.",
    "Assault ramp: Passengers can still make a 6\" charge move after the vehicle moves and they exit.",
    "Lumbering Behemoth: The model may not receive an \"Advance\" order. Additionally, it always counts as having received a \"Stand & Shoot\" order when shooting its weapons.",
    "Transport: This model has a transport capacity of 50 infantry models."
  ],
  "unit_type": "Super-heavy Vehicle",
  "keywords": [
    "Lord of War"
  ],
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
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 501
};
