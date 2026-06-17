/**
 * HEARTHKYN WARRIORS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hearthkynWarriors: Unit = {
  "name": "Hearthkyn Warriors",
  "models": [
    {
      "name": "Hearthkyn Warriors",
      "points": 20,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
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
        "A": "1",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Autoch-pattern bolter; Autoch-pattern bolt pistol; Gravitic concussion grenade.",
  "weapons": [
    {
      "name": "Autoch-pattern bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Autoch-pattern bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Concussion gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2), Unwieldy"
    },
    {
      "name": "EtaCarn plasma beamer",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "Beam"
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
      "name": "HYLas auto rifle",
      "range": "24\"",
      "type": "Assault 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ion blaster",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Magna-rail rifle",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Beam, Decimate, Tank hunter"
    },
    {
      "name": "MPL7 missile launcher",
      "range": "30\"",
      "type": "Assault 7",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 10 models, two Hearthkyn Warriors may swap their Autoch-pattern bolter",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Plasma axe",
          "points": 0
        },
        {
          "name": "Plasma sword",
          "points": 0
        },
        {
          "name": "Concussion gauntlet",
          "points": 8
        },
        {
          "name": "HYLas auto rifle",
          "points": 19
        },
        {
          "name": "EtaCarn plasma beamer",
          "points": 27
        },
        {
          "name": "MPL7 missile launcher",
          "points": 37
        },
        {
          "name": "Magna-rail rifle",
          "points": 50
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to 3 different Hearthkyn Warriors may take one of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Medipack",
          "points": 5
        },
        {
          "name": "Multiwave comms array",
          "points": 5
        },
        {
          "name": "Pan spectral scanner",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All remaining models in the unit may have their Autoch-pattern bolter swapped",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ion blaster",
          "points": 0
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
    "Eye of the Ancestors, Steady Advance, Void armor",
    "Medipack: The model gains the \"Narthecium\" ability.",
    "Multiwave comms array: The unit may use the Ld value of a friendly Kâhl, if any is present and alive in the army.",
    "Pan spectral scanner: All weapons of the unit gain +1 AP when shooting at targets that benefit from cover."
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 100
};
