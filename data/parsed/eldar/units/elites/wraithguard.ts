/**
 * WRAITHGUARD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wraithguard: Unit = {
  "name": "Wraithguard",
  "models": [
    {
      "name": "Wraithguard",
      "points": 64,
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
  "equipped_with": "Every model is equipped with: D-scythe.",
  "weapons": [
    {
      "name": "D-scythe",
      "range": "9\"",
      "type": "Assault 2",
      "s": "D",
      "ap": "-4",
      "d": "1",
      "abilities": "AT(2), Deadly(5+), Distortion, Flames"
    },
    {
      "name": "Wraithcannon",
      "range": "18\"",
      "type": "Assault 2",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Deadly(5+), Graviton"
    }
  ],
  "option_groups": [
    {
      "header": "All models may swap their D-scythe",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Wraithcannon",
          "points": 54
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Massive(1), <Wraith>",
    "Distortion: The weapon has a -1 penalty for to wound rolls.",
    "Strength \"D\": A to wound roll of 2+ always wounds a creature or penetrates a vehicle.",
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
  "min_cost": 192
};
