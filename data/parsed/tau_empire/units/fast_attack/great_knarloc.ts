/**
 * GREAT KNARLOC — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const greatKnarloc: Unit = {
  "name": "Great Knarloc",
  "models": [
    {
      "name": "Great Knarloc",
      "points": 92,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "4+",
        "S": "6",
        "T": "5",
        "W": "6",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Great Knarloc is equipped with: Knarloc beak; Knarloc claws.",
  "weapons": [
    {
      "name": "Knarloc beak",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Knarloc claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Kroot long gun",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Repeater cannon",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Kroot bolt thrower - Iron bolts",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "-1",
      "d": "2",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Kroot bolt thrower - Explosive bolts",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Any Great Knarloc may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Knarloc armor",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any Great Knarloc may be equipped with one howdah",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Repeater cannon",
          "points": 15
        },
        {
          "name": "Kroot long gun",
          "points": 22
        },
        {
          "name": "Kroot bolt thrower",
          "points": 66
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Squadron, Supporting Fire, Use Cover",
    "Knarloc armor: The model gains a 4+ armor save."
  ],
  "unit_type": "Monstrous Creature, Kroot",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 92
};
