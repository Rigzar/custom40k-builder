/**
 * SISTERS OF SILENCE — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sistersOfSilence: Unit = {
  "name": "Sisters of Silence",
  "models": [
    {
      "name": "Sister of Silence",
      "points": 20,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Boltgun; Psyk-out grenades.",
  "weapons": [
    {
      "name": "Boltgun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Executioner greatblade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Psyk-out grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "1",
      "ap": "0",
      "d": "1",
      "abilities": "Psi-shock"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap its Flamer",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Boltgun",
          "points": 0
        },
        {
          "name": "Executioner greatblade",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Null-Maiden: The unit can never be targeted by psychic powers. Enemy psykers within 18\" suffer a -1 penalty on any roll to manifest and dispel psychic powers. Enemy units within 12\" suffer a -1 penalty to their Leadership. All ranged and melee attacks made by the unit against a target within 6\" gain \"Shield breaker(-1)\"."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 100
};
