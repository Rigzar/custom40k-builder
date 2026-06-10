/**
 * PLAGUEBEARERS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const plaguebearers: Unit = {
  "name": "Plaguebearers",
  "models": [
    {
      "name": "Plaguebearers",
      "points": 20,
      "min": 6,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    },
    {
      "name": "Plagueridden",
      "points": 20,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Plaguesword.",
  "weapons": [
    {
      "name": "Plaguesword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(4+)"
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
    }
  ],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Nurgle, Terrifying(-1)",
    "Icon of Chaos: A friendly Daemon unit arriving within 3\" of the bearer via Deep strike does not scatter. If the arriving unit has the same Mark of Chaos as the bearer, it can instead be placed within 6\". The icon must be present on the table at the beginning of the battle round in order to be used.",
    "Instrument of Chaos: The unit gains a bonus of +1 to Combat resolutions."
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
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Troops",
  "default_size": 7,
  "min_cost": 140
};
