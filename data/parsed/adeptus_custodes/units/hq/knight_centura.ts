/**
 * KNIGHT-CENTURA — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const knightCentura: Unit = {
  "name": "Knight-Centura",
  "models": [
    {
      "name": "Knight-Centura",
      "points": 56,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Knight-Centura is equipped with: Psyk-out grenade.",
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
      "header": "Can swap the Flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Boltgun",
          "points": 3
        },
        {
          "name": "Executioner greatblade",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Has acces to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Null-Maiden: The unit can never be targeted by psychic powers. Enemy psykers within 18\" suffer a -1 penalty on any roll to manifest and dispel psychic powers. Enemy units within 12\" suffer a -1 penalty to their Leadership. All ranged and melee attacks made by the unit against a target within 6\" gain \"Shield breaker(-1)\"."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 56
};
