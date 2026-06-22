/**
 * NEOPHYTE HYBRIDS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const neophyteHybrids: Unit = {
  "name": "Neophyte Hybrids",
  "models": [
    {
      "name": "Neophyte Hybrid",
      "points": 10,
      "min": 10,
      "max": 20,
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
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Neophyte Leader",
      "points": 15,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Autogun; Autopistol; Blasting charges; Frag grenade.",
  "weapons": [
    {
      "name": "Autogun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Mining laser",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Explosive"
    },
    {
      "name": "Shotgun",
      "range": "18\"",
      "type": "Assault 2",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Webber",
      "range": "18\"",
      "type": "Assault 2",
      "s": "1",
      "ap": "0",
      "d": "1",
      "abilities": "Monofilament"
    },
    {
      "name": "Grenade launcher - Frag",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grenade launcher - Krak",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Seismic cannon - Long wave",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Seismic cannon - Short wave",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may replace their Autogun",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shotgun",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Autogun"]
    },
    {
      "header": "One model may get a Cult icon for +15 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each 10 models, two Neophytes may swap their Autogun",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Webber",
          "points": 0
        },
        {
          "name": "Grenade launcher",
          "points": 4
        },
        {
          "name": "Flamer",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Autogun"]
    },
    {
      "header": "For each 10 models, two Neophytes may swap their Autogun",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Heavy stubber",
          "points": 9
        },
        {
          "name": "Seismic cannon",
          "points": 12
        },
        {
          "name": "Mining laser",
          "points": 36
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Autogun"]
    },
    {
      "header": "One model may be upgraded to a Neophyte Leader for +5 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Neophyte Leader",
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
  "default_size": 10,
  "min_cost": 100
};
