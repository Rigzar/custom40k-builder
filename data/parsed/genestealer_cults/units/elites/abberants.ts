/**
 * ABBERANTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const abberants: Unit = {
  "name": "Abberants",
  "models": [
    {
      "name": "Aberrant",
      "points": 30,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aberrant Hypermorph",
      "points": 40,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Power pick.",
  "weapons": [
    {
      "name": "Power pick",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Flurry(1)"
    },
    {
      "name": "Power hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "-2",
      "abilities": "AT(2), Slow(-2)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Power pick",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Power hammer",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to an Aberrant Hypermorph for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Aberrant Hypermorph",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Berserk(5+), Infiltrator, Massive(1), Use cover"
  ],
  "unit_type": "Monstrous Infantry",
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 150
};
