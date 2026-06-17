/**
 * WINDRIDERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const windriders: Unit = {
  "name": "Windriders",
  "models": [
    {
      "name": "Windrider",
      "points": 39,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Twin shuriken catapult.",
  "weapons": [
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
      "header": "Each model may swap its Twin shuriken catapult",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Scatter laser",
          "points": 8
        },
        {
          "name": "Shuriken cannon",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus"
  ],
  "unit_type": "Jetbike",
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
  "min_cost": 117
};
