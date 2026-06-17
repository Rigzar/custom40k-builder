/**
 * BROADSIDE BATTLESUITS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const broadsideBattlesuits: Unit = {
  "name": "Broadside Battlesuits",
  "models": [
    {
      "name": "Broadside Shas'ui",
      "points": 123,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "2",
        "A": "2",
        "LD": "7",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Broadside Shas'vre",
      "points": 128,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "2",
        "A": "2",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "equipped_with": "All models are equipped with: 2 High-yield missile pods.",
  "weapons": [
    {
      "name": "Heavy rail rifle",
      "range": "60\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "High-yield missile pod",
      "range": "30\"",
      "type": "Heavy 5",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Twin plasma rifle",
      "range": "24\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin smart missile system",
      "range": "30\"",
      "type": "Heavy 6",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Anti-Air, Indirect, Sunder(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model can swap their two High-yield missile pods",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy rail rifle",
          "points": 58
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any model can be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin smart missile system",
          "points": 21
        },
        {
          "name": "Twin plasma rifle",
          "points": 28
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Broadside Shas'ui may be upgraded to a Shas'vre for +5pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Broadside Shas'vre",
      "is_unique_per_army": false
    },
    {
      "header": "Any model may pick up to two SUPPORT SYSTEMS from the armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A Shas'vre may buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron, Supporting Fire, Unyielding"
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 123
};
