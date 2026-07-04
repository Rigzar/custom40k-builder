/**
 * KROOT TRACKERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootTrackers: Unit = {
  "name": "Kroot Trackers",
  "models": [
    {
      "name": "Tracker",
      "points": 31,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Trackers are equipped with: Knarloc talons; Kroot rifle.",
  "weapons": [
    {
      "name": "Knarloc talons",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "1",
      "abilities": "Extra attack, Flurry(1)"
    },
    {
      "name": "Kroot hunting rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Kroot pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot rifle - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot rifle - Ranged",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot carbine - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot carbine - Ranged",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Any number of models may replace their Kroot rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Kroot knife and kroot pistol",
          "points": 0
        },
        {
          "name": "Kroot carbine",
          "points": 2
        },
        {
          "name": "Kroot hunting rifle",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Kroot rifle - Melee", "Kroot rifle - Ranged"]
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire, Use Cover, Vanguard"
  ],
  "unit_type": "Bike, Kroot",
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
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 93
};
