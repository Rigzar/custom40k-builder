/**
 * GROTESQUES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const grotesques: Unit = {
  "name": "Grotesques",
  "models": [
    {
      "name": "Grotesque",
      "points": 36,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Flesh gauntlet; Monstrous cleaver.",
  "weapons": [
    {
      "name": "Flesh gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "Deadly(5+), Extra attack, Poison(2+)"
    },
    {
      "name": "Monstrous cleaver",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Liquifier gun",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "Every model may swap their Monstrous cleaver each",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Liquifier gun",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Monstrous cleaver"]
    }
  ],
  "abilities": [
    "Massive(1), Power through Pain",
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
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 108
};
