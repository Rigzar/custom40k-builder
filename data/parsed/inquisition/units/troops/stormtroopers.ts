/**
 * STORMTROOPERS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormtroopers: Unit = {
  "name": "Stormtroopers",
  "models": [
    {
      "name": "Stormtrooper",
      "points": 16,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Stormtrooper Veteran",
      "points": 21,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Frag grenade; Hot-shot lasgun; Krak grenade.",
  "weapons": [
    {
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Hot-shot lasgun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Hot-shot laspistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Hot-shot volley gun",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "3",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Sniper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, two Stormtroopers may swap their Hot-shot lasguns",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 0
        },
        {
          "name": "Grenade launcher",
          "points": 2
        },
        {
          "name": "Hot-shot volley gun",
          "points": 6
        },
        {
          "name": "Melta",
          "points": 11
        },
        {
          "name": "plasma gun",
          "points": 16
        },
        {
          "name": "Sniper rifle",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may get one of these abilities (points per model)",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Deep strike",
          "points": 0
        },
        {
          "name": "Infiltrator",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Sniper: Models equipped with a Sniper rifle get a +1 bonus to their BS."
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
  "default_size": 5,
  "min_cost": 85
};
