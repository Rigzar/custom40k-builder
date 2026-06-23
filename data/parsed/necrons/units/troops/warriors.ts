/**
 * WARRIORS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const warriors: Unit = {
  "name": "Warriors",
  "models": [
    {
      "name": "Warrior",
      "points": 19,
      "min": 10,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Gauss flayer.",
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
      "name": "Gauss flayer",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Gauss reaper",
      "range": "12\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Gauss"
    }
  ],
  "option_groups": [
    {
      "header": "The unit can swap their Gauss flayers",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Gauss reaper",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Gauss flayer"]
    },
    {
      "header": "The unit can be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Disruptor field",
          "points": 1
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
  "default_size": 10,
  "min_cost": 190
};
