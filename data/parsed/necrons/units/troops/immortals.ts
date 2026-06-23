/**
 * IMMORTALS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const immortals: Unit = {
  "name": "Immortals",
  "models": [
    {
      "name": "Immortal",
      "points": 43,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "1",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Tesla carbine.",
  "weapons": [
    {
      "name": "Disruptor field",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gauss blaster",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Tesla carbine",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla, AT(-1)"
    }
  ],
  "option_groups": [
    {
      "header": "The unit can swap their Tesla carbines",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Gauss blaster",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Tesla carbine"]
    },
    {
      "header": "The unit can be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Disruptor field",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Reanimation Protocols"
  ],
  "unit_type": "Infantry, Necron",
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 215
};
