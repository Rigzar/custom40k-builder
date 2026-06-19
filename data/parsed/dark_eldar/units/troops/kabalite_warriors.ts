/**
 * KABALITE WARRIORS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kabaliteWarriors: Unit = {
  "name": "Kabalite Warriors",
  "models": [
    {
      "name": "Kabalite",
      "points": 14,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Sybarite",
      "points": 19,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Splinter rifle.",
  "weapons": [
    {
      "name": "Blaster",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    },
    {
      "name": "Dark lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Shredder",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Suppression"
    },
    {
      "name": "Splinter cannon",
      "range": "36\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Splinter rifle",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, one Kabalite may swap their Splinter rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Shredder",
          "points": 13
        },
        {
          "name": "Blaster",
          "points": 29
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each 10 models, one Kabalite may swap their Splinter rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Splinter cannon",
          "points": 18
        },
        {
          "name": "Dark lance",
          "points": 53
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Sybarite for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Sybarite",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Power through Pain"
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Kabal"
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
  "min_cost": 70
};
