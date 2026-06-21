/**
 * KROOT FARSTALKERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootFarstalkers: Unit = {
  "name": "Kroot Farstalkers",
  "models": [
    {
      "name": "Farstalker",
      "points": 11,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Kill-Broker",
      "points": 12,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    },
    {
      "name": "Kroot Hound",
      "points": 9,
      "min": 0,
      "max": 4,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Farstalkers and Kill-Brokers are equipped with: Kroot knife; Kroot rifle.",
  "weapons": [
    {
      "name": "Dvorgite skinner",
      "range": "12\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Kroot knife",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot hunting rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Kroot pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Londaxi tribalest",
      "range": "18\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Pulse carbine",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Pulse rifle",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ripping fangs",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot rifle - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot rifle - Ranged",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot scattergun - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot scattergun - Ranged",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Accelerator bow - Fused arrow",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Lance(2)"
    },
    {
      "name": "Accelerator bow - Voltaic arrow",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Kroot rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Kroot pistol",
          "points": 0
        },
        {
          "name": "Kroot scattergun",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Kroot rifle - Melee", "Kroot rifle - Ranged"]
    },
    {
      "header": "For every 5 non-Kroot hound models in the unit, one Farstalker may replace their Kroot rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Accelerator bow",
          "points": 10
        },
        {
          "name": "Londaxi tribalest",
          "points": 13
        },
        {
          "name": "Dvorgite skinner",
          "points": 14
        },
        {
          "name": "Kroot hunting rifle",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Farstalker may be equipped with a Pech'ra for +10 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Kill-Broker may swap their Kroot rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Pulse rifle",
          "points": 2
        },
        {
          "name": "Pulse carbine",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire, Use Cover",
    "Bounty Hunters: After all units have been deployed, nominate an enemy unit. This unit gets +1 to hit rolls against that unit. If that unit is destroyed, you may nominate another unit.",
    "Pech'ra: All ranged weapons carried by the unit gain the \"Sunder(1)\" ability.",
    "Sniper: Models with a Kroot hunting rifle receive a +1 bonus to their BS value."
  ],
  "unit_type": "Bike (Kroot hounds only), Infantry, Kroot",
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
  "min_cost": 56
};
