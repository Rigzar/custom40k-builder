/**
 * BRÔKHYR THUNDERKYN — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const brKhyrThunderkyn: Unit = {
  "name": "Brôkhyr Thunderkyn",
  "models": [
    {
      "name": "Brôkhyr Thunderkyn",
      "points": 57,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bolt cannon; Omni-visor.",
  "weapons": [
    {
      "name": "Bolt cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Graviton blast cannon",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "Explosive, Graviton"
    },
    {
      "name": "SP heavy conversion beamer - Short range",
      "range": "1\" - 10\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Barrage"
    },
    {
      "name": "SP heavy conversion beamer - Mid range",
      "range": "11\" - 20\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "SP heavy conversion beamer - Long range",
      "range": "21\" - 30\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "All models may swap their Bolt cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Graviton blast cannon",
          "points": 25
        },
        {
          "name": "SP heavy conversion beamer",
          "points": 54
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Massive(1), Steady Advance, Void armor",
    "Omni-visors: The model ignores the -1 to hit modifier for cover."
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
  "slot": "Heavy Support",
  "default_size": 3,
  "min_cost": 171
};
