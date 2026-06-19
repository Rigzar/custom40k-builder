/**
 * TAUROS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tauros: Unit = {
  "name": "Tauros",
  "models": [
    {
      "name": "Tauros",
      "points": 108,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Tauros Venator",
      "points": 119,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "equipped_with": "A Tauros is equipped with: Tauros grenade launcher.",
  "weapons": [
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
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin multilaser",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "6",
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
      "header": "Any Tauros may be upgraded to a Tauros Venator for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": "Tauros Venator",
      "is_unique_per_army": false
    },
    {
      "header": "A Tauros may swap its Tauros grenade launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A Tauros Venator may swap its Twin-linked heavy stubber",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin multilaser",
          "points": 5
        },
        {
          "name": "Twin lascannon",
          "points": 81
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron, Vanguard",
    "All-terrain Vehicle: This vehicle may re-roll dangerous terrain tests and ignores difficult terrain."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 108
};
