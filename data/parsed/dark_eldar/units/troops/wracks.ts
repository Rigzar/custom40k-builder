/**
 * WRACKS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wracks: Unit = {
  "name": "Wracks",
  "models": [
    {
      "name": "Wrack",
      "points": 11,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "1",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Acothyst",
      "points": 16,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Wrack blades.",
  "weapons": [
    {
      "name": "Liquifier gun",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Ossefactor",
      "range": "24\"",
      "type": "Assault 1",
      "s": "2",
      "ap": "-3",
      "d": "2",
      "abilities": "Poison(2+)"
    },
    {
      "name": "Wrack blades",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, one Wrack may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Liquifier gun",
          "points": 15
        },
        {
          "name": "Ossefactor",
          "points": 23
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Acothyst for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Acothyst",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Power through Pain",
    "Transformed shape: The unit starts with a \"Power through Pain\" token."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Coven"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 55
};
