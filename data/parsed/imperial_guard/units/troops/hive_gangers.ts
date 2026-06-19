/**
 * HIVE GANGERS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hiveGangers: Unit = {
  "name": "Hive Gangers",
  "models": [
    {
      "name": "Hive Ganger",
      "points": 4,
      "min": 9,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "5",
        "SV": "6+"
      }
    },
    {
      "name": "Gang Champion",
      "points": 9,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Gang firearm; Gang pistol.",
  "weapons": [
    {
      "name": "Close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang autocannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Gang firearm",
      "range": "18\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang flamer",
      "range": "6\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Gang grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang heavy flamer",
      "range": "6\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Gang melta",
      "range": "9\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Gang multi-melta",
      "range": "14\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Gang pistol",
      "range": "9\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang plasma cannon",
      "range": "27\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Gang plasma gun",
      "range": "18\"",
      "type": "Rapid Fire 1",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Gang power axe",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang power fist",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Gang power sword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang shotgun",
      "range": "14\"",
      "type": "Assault 2",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang sniper rifle",
      "range": "27\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Gang stubber",
      "range": "27\"",
      "type": "Heavy 3",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gang thunder hammer",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Slow(-3)"
    },
    {
      "name": "Heavy close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "0",
      "d": "1",
      "abilities": "Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Orlock",
          "points": 0
        },
        {
          "name": "Cawdor",
          "points": 1
        },
        {
          "name": "Delaque",
          "points": 1
        },
        {
          "name": "Escher",
          "points": 1
        },
        {
          "name": "Goliath",
          "points": 2
        },
        {
          "name": "Van Saar",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Close combat weapon",
          "points": 1
        },
        {
          "name": "Heavy close combat weapon",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to two models may swap their Gang firearms",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Gang flamer",
          "points": 1
        },
        {
          "name": "Gang power axe",
          "points": 1
        },
        {
          "name": "Gang power sword",
          "points": 1
        },
        {
          "name": "Gang shotgun",
          "points": 1
        },
        {
          "name": "Gang grenade launcher",
          "points": 5
        },
        {
          "name": "Gang plasma gun",
          "points": 5
        },
        {
          "name": "Gang melta",
          "points": 7
        },
        {
          "name": "Gang sniper rifle",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may swap the Gang firearm",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gang stubber",
          "points": 5
        },
        {
          "name": "Gang power fist",
          "points": 6
        },
        {
          "name": "Gang thunder hammer",
          "points": 9
        },
        {
          "name": "Gang autocannon",
          "points": 13
        },
        {
          "name": "Gang heavy flamer",
          "points": 15
        },
        {
          "name": "Gang multi-melta",
          "points": 16
        },
        {
          "name": "Gang plasma cannon",
          "points": 18
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Hive Scum: This unit may not make use of any order.",
    "Sniper: Models with a Gang sniper rifle receive a +1 bonus to their BS value.",
    "Upgrades:",
    "Cawdor: The model gains +1 Leadership.",
    "Delaque: The model gains \"Infiltrator\".",
    "Escher: All weapons of the model gain \"Poison(5+)\".",
    "Goliath: The model gains +1 Strength and +1 Toughness.",
    "Orlock: Another model may swap their Gang firearm.",
    "Van Saar: The model gains a 5+ armour save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 10,
  "min_cost": 45
};
