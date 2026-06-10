/**
 * PINK HORRORS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const pinkHorrors: Unit = {
  "name": "Pink Horrors",
  "models": [
    {
      "name": "Pink Horror",
      "points": 38,
      "min": 8,
      "max": 26,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "9",
        "SV": "6+"
      }
    },
    {
      "name": "Iredescent Horror",
      "points": 38,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "9",
        "SV": "6+"
      }
    },
    {
      "name": "Blue Horror",
      "points": 0,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "2",
        "T": "2",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "9",
        "SV": "6+"
      }
    },
    {
      "name": "Brimstone Horror",
      "points": 0,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "6+",
        "BS": "5+",
        "S": "1",
        "T": "1",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Coruscating flames.",
  "weapons": [
    {
      "name": "Coruscating flames",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
    "Deepstrike, Daemon, Daemonic instability, Mark of Tzeentch, Terrifying(-1)",
    "Icon of Chaos: A friendly Daemon unit arriving within 3\" of the bearer via Deep strike does not scatter. If the arriving unit has the same Mark of Chaos as the bearer, it can instead be placed within 6\". The icon must be present on the table at the beginning of the battle round in order to be used.",
    "Instrument of Chaos: The unit gains a bonus of +1 to Combat resolutions.",
    "Split: After each activation in which the unit lost at least one Pink Horror or Blue Horror, roll a die for each lost model. On a 4+, a killed Pink Horror is replaced by 2 Blue Horrors. A killed Blue Horror is replaced by a Brimstone Horror."
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
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Troops",
  "default_size": 11,
  "min_cost": 360
};
