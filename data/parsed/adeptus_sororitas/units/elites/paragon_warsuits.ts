/**
 * PARAGON WARSUITS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const paragonWarsuits: Unit = {
  "name": "Paragon Warsuits",
  "models": [
    {
      "name": "Paragon",
      "points": 113,
      "min": 2,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    },
    {
      "name": "Paragon Superior",
      "points": 118,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Heavy flamer; Paragon war blade; 2 Storm bolters.",
  "weapons": [
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Paragon grenade launcher",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Paragon war blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Paragon war mace",
      "range": "-",
      "type": "Melee",
      "s": "+4",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap both Storm bolters",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Paragon grenade launcher",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Storm bolter"]
    },
    {
      "header": "Each model may swap the Heavy flamer",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 5
        },
        {
          "name": "Multi-melta",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy flamer"]
    },
    {
      "header": "Each model may swap the Paragon war blade",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Paragon war mace",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Paragon war blade"]
    }
  ],
  "abilities": [
    "Acts of Faith, Shield of Faith",
    "Pious: A Paragon Superior increases the Faith Points by +1."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "armory_gear_only": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 344
};
