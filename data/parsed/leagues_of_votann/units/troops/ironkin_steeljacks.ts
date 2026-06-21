/**
 * IRONKIN STEELJACKS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ironkinSteeljacks: Unit = {
  "name": "Ironkin Steeljacks",
  "models": [
    {
      "name": "Ironkin Steeljack",
      "points": 46,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
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
  "variant_models": [
    {
      "name": "Theyn",
      "points": 56,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Autoch-pattern bolt pistol; Plasma sword.",
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
      "name": "Concussion gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2), Unwieldy"
    },
    {
      "name": "Heavy volkanite desintegrator",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Deadly(5+)"
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
      "header": "Each model may swap their Plasma sword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy volkanite desintegrator",
          "points": 0
        },
        {
          "name": "Concussion gauntlet",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Plasma sword"]
    },
    {
      "header": "One model may be upgraded to a Theyn for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Theyn",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Steady Advance, Unyielding, Void armor"
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
  "default_size": 3,
  "min_cost": 138
};
