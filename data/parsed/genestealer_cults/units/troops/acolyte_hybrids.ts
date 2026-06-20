/**
 * ACOLYTE HYBRIDS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const acolyteHybrids: Unit = {
  "name": "Acolyte Hybrids",
  "models": [
    {
      "name": "Acolyte Hybrid",
      "points": 11,
      "min": 5,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Acolyte Leader",
      "points": 16,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Autopistol; Blasting charges; Claws and knives.",
  "weapons": [
    {
      "name": "Autopistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Blasting charges",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Claws and knives",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Demolition charge",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage, Seeking"
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
      "name": "Hand flamer",
      "range": "6\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heavy rock cutter",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "Armorbane, AT(3), Decimate, Slow(-3), Unwieldy"
    },
    {
      "name": "Heavy rock drill",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Slow(-1), Unwieldy"
    },
    {
      "name": "Heavy rock saw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Decimate, Slow(-2), Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may replace their Autopistol",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Hand flamer",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Autopistol"]
    },
    {
      "header": "One model may replace their Autopistol with a Cult icon for +15pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each 5 models, two Acolytes may swap their Autopistol and Claws and knives",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Heavy rock drill",
          "points": 5
        },
        {
          "name": "Heavy rock saw",
          "points": 12
        },
        {
          "name": "Demolition charge",
          "points": 13
        },
        {
          "name": "Heavy rock cutter",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Autopistol", "Claws and knives"]
    },
    {
      "header": "One model may be upgraded to an Acolyte Leader for +5 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Acolyte Leader",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Infiltrator, Use cover",
    "Cult icon: During each Reinforcement phase, 1D6 slain models return to the unit."
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
  "min_cost": 55
};
