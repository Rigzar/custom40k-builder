/**
 * KROOT CARNIVORES — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootCarnivores: Unit = {
  "name": "Kroot Carnivores",
  "models": [
    {
      "name": "Carnivore",
      "points": 10,
      "min": 9,
      "max": 29,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Long-quill",
      "points": 10,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Carnivores and Long-quills are equipped with: Kroot rifle.",
  "weapons": [
    {
      "name": "Tanglebomb launcher",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Monofilament, Suppression"
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
      "header": "For every 5 non-Kroot hound models in the unit, one Carnivore may replace their Kroot rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Tanglebomb launcher",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Kroot rifle"]
    },
    {
      "header": "The Long-quill may swap their Kroot rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Kroot carbine",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Kroot rifle"]
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire, Use Cover"
  ],
  "unit_type": "Infantry, Kroot",
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
  "min_cost": 100
};
