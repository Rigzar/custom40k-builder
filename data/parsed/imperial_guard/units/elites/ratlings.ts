/**
 * RATLINGS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ratlings: Unit = {
  "name": "Ratlings",
  "models": [
    {
      "name": "Ratling",
      "points": 30,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "2+",
        "S": "2",
        "T": "2",
        "W": "1",
        "I": "4",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Sniper rifle.",
  "weapons": [
    {
      "name": "Demolition charge",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage"
    },
    {
      "name": "Sniper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Tankstopper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, one Ratling may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Tankstopper rifle",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 models, one Ratling may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Demolition charge",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may be equipped with a Battlemutt fur +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Use cover"
  ],
  "unit_type": "Infantry, Battlemutt: Once per game, the unit can perform a Defensive reaction, even if it has already used its order in that combat round.",
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
  "default_size": 5,
  "min_cost": 150
};
