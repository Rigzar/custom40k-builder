/**
 * STEALTH BATTLESUITS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stealthBattlesuits: Unit = {
  "name": "Stealth Battlesuits",
  "models": [
    {
      "name": "Stealth Shas'ui",
      "points": 34,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "2",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Stealth Shas'vre",
      "points": 49,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "2",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "All models are equipped with: Burst cannon.",
  "weapons": [
    {
      "name": "Burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Fusion blaster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 3 models, one model may swap their Burst cannon",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Fusion blaster",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Burst cannon"]
    },
    {
      "header": "One Stealth Shas'ui may be upgraded to a Shas'vre for +5pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Stealth Shas'vre",
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
    "Infiltrator, Stealth, Supporting Fire"
  ],
  "unit_type": "Infantry, Jump Pack Infantry",
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
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 102
};
