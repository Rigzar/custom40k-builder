/**
 * REAVERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const reavers: Unit = {
  "name": "Reavers",
  "models": [
    {
      "name": "Reaver",
      "points": 35,
      "min": 3,
      "max": 12,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Arena Champion",
      "points": 45,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Bladevanes; Splinter pistol; Splinter rifle.",
  "weapons": [
    {
      "name": "Bladevanes",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Blaster",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    },
    {
      "name": "Heat lance",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-5",
      "d": "2",
      "abilities": "Lance(+2), Melta"
    },
    {
      "name": "Splinter pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Splinter rifle",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Splinter rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heat lance",
          "points": 19
        },
        {
          "name": "Blaster",
          "points": 29
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Splinter rifle"]
    },
    {
      "header": "One model may be upgraded to an Arena Champion for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Arena Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat drugs, Hit & Run, Power through Pain"
  ],
  "unit_type": "Jetbike",
  "keywords": [
    "Cult"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 105
};
