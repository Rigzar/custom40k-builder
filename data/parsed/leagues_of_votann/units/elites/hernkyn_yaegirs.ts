/**
 * HERNKYN YAEGIRS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hernkynYaegirs: Unit = {
  "name": "Hernkyn Yaegirs",
  "models": [
    {
      "name": "Yaegir",
      "points": 20,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Theyn",
      "points": 25,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Bolt shotgun; Gravitic concussion grenades.",
  "weapons": [
    {
      "name": "APM launcher",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-3",
      "d": "2",
      "abilities": "Armorbane, Decimate"
    },
    {
      "name": "Bolt revolver",
      "range": "9\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt shotgun",
      "range": "12\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    },
    {
      "name": "Magna-coil rifle",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Plasma knife",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, two Hernkyn Pioneers may swap their Bolt shotgun",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "APM launcher",
          "points": 15
        },
        {
          "name": "Magna-coil rifle",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All remaining models may swap their Bolt shotguns",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Bolt revolver and Plasma knife",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Theyn for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Theyn",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Infiltrator, Steady Advance, Use cover, Void armor"
  ],
  "unit_type": "Infantry, Sniper: Models with a Magna-coil rifle receive a +1 bonus to their BS value.",
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
  "min_cost": 100
};
