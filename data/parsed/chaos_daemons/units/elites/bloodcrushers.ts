/**
 * BLOODCRUSHERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bloodcrushers: Unit = {
  "name": "Bloodcrushers",
  "models": [
    {
      "name": "Bloodcrusher",
      "points": 41,
      "min": 2,
      "max": 7,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "6+"
      }
    },
    {
      "name": "Bloodhunter",
      "points": 41,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Hellblade.",
  "weapons": [
    {
      "name": "Hellblade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Icon of Chaos",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Another model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Instrument of Chaos",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may be equipped with brass armor for +41 points per model.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 41,
      "per_model": true,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Khorne, Terrifying(-1)",
    "Brass armor: The model gains a 3+ save.",
    "Icon of Chaos: A friendly Daemon unit arriving within 3\" of the bearer via Deep strike does not scatter. If the arriving unit has the same Mark of Chaos as the bearer, it can instead be placed within 6\". The icon must be present on the table at the beginning of the battle round in order to be used.",
    "Instrument of Chaos: The unit gains a bonus of +1 to Combat resolutions."
  ],
  "unit_type": "Bike",
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
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 123
};
