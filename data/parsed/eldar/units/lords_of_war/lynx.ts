/**
 * LYNX — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lynx: Unit = {
  "name": "Lynx",
  "models": [
    {
      "name": "Lynx",
      "points": 366,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "11",
        "I": "5",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Lynx is equipped with: Scatter laser; Sonic lance.",
  "weapons": [
    {
      "name": "Bright lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Pulsar - Saturation",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4), Barrage"
    },
    {
      "name": "Pulsar - Salvo",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4)"
    },
    {
      "name": "Scatter laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
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
      "name": "Sonic lance",
      "range": "36\"",
      "type": "Heavy 12",
      "s": "*",
      "ap": "-4",
      "d": "1",
      "abilities": "AT(1), Flames, Soundquake, Suppression"
    },
    {
      "name": "Starcannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Scatter laser",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 1
        },
        {
          "name": "Starcannon",
          "points": 30
        },
        {
          "name": "Bright lance",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Scatter laser"]
    },
    {
      "header": "May swap the Sonic lance",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Pulsar",
          "points": 132
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Sonic lance"]
    }
  ],
  "abilities": [
    "Anti-Grav, Battle Focus",
    "Soundquake: To wound rolls of 3+ against creatures always succeed. If this weapon targets a vehicle, it suffers one automatic hit at Strength 1 that rolls 3D6 for armor penetration."
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
  "min_cost": 366
};
