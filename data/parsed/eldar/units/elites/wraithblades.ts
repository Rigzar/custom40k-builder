/**
 * WRAITHBLADES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wraithblades: Unit = {
  "name": "Wraithblades",
  "models": [
    {
      "name": "Wraithblade",
      "points": 51,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Ghostswords.",
  "weapons": [
    {
      "name": "Ghostaxe",
      "range": "6\"",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Flurry(1)"
    },
    {
      "name": "Ghostswords",
      "range": "6\"",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Ghostswords",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Ghostaxe and Forceshield",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Ghostswords"]
    }
  ],
  "abilities": [
    "Massive(1), <Wraith>",
    "Forceshield: The model gains the \"Deflect\" and \"Parry\" abilities.",
    "Wraithbone: Reduces AP of enemy attacks by -1 (to a minimum of 0)."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [
    "Wraith"
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
  "min_cost": 153
};
