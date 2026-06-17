/**
 * HAMMERHEAD GUNSHIP — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hammerheadGunship: Unit = {
  "name": "Hammerhead Gunship",
  "models": [
    {
      "name": "Hammerhead",
      "points": 255,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hammerhead is a single model and equipped with: Burst cannon; Twin Swiftstrike burst cannon; 2 Twin pulse carbines.",
  "weapons": [
    {
      "name": "Burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Smart missile system",
      "range": "30\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Seeking"
    },
    {
      "name": "Twin pulse carbine",
      "range": "24\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Twin Swiftstrike burst cannon",
      "range": "36\"",
      "type": "Rapid Fire 10",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ion cannon - Standard",
      "range": "60\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Ion cannon - Overcharged",
      "range": "60\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Railgun - Solid shot",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "5",
      "abilities": "AT(4), Beam, Decimate, Tank hunter"
    },
    {
      "name": "Railgun - Submunition",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Twin Swiftstrike burst cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ion cannon",
          "points": 62
        },
        {
          "name": "Railgun",
          "points": 69
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace both Twin pulse carbines",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Two burst cannons",
          "points": 0
        },
        {
          "name": "two Smart missile systems",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Supporting Fire"
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
  "min_cost": 255
};
