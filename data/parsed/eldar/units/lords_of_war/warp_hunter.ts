/**
 * WARP HUNTER — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const warpHunter: Unit = {
  "name": "Warp Hunter",
  "models": [
    {
      "name": "Warp Hunter",
      "points": 335,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "5",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Warp Hunter is equipped with: D-flail; Twin shuriken catapult.",
  "weapons": [
    {
      "name": "D-flail - Blast",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Barrage, Deadly(5+), Graviton"
    },
    {
      "name": "D-flail - Rift",
      "range": "9\"",
      "type": "Heavy 4",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Deadly(5+), Flames, Graviton"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Twin shuriken catapult",
      "range": "18\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Twin shuriken catapult",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin shuriken catapult"]
    }
  ],
  "abilities": [
    "Anti-Grav, Battle Focus"
  ],
  "unit_type": "Vehicle",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 335
};
