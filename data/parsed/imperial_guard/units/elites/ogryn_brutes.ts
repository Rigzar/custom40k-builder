/**
 * OGRYN BRUTES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ogrynBrutes: Unit = {
  "name": "Ogryn Brutes",
  "models": [
    {
      "name": "Brute",
      "points": 33,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Crude weapon.",
  "weapons": [
    {
      "name": "Crude weapon",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Power drill",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Slow(-3)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, one Brute may replace their Crude weapon",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Power drill",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Furious Charge, Massive(1)"
  ],
  "unit_type": "Infantry",
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
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 99
};
