/**
 * CRISIS BATTLESUITS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';
import { TAU_DRONE_CHOICES } from '../../drone_choices';

export const crisisBattlesuits: Unit = {
  "name": "Crisis Battlesuits",
  "models": [
    {
      "name": "Crisis Shas'ui",
      "points": 37,
      "min": 2,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Crisis Shas'vre",
      "points": 42,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "All models are equipped with: -.",
  "weapons": [
    {
      "name": "Airbursting fragmentation projector",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Indirect, Suppression"
    },
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
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Fusion blaster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(3)"
    },
    {
      "name": "Missile pod",
      "range": "30\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Plasma rifle",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Any model can be equipped with up to two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 7
        },
        {
          "name": "Airbursting fragmentation projector",
          "points": 8
        },
        {
          "name": "Burst cannon",
          "points": 12
        },
        {
          "name": "Plasma rifle",
          "points": 14
        },
        {
          "name": "Missile pod",
          "points": 21
        },
        {
          "name": "Fusion blaster",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
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
      "header": "One Crisis Shas'ui may be upgraded to a Shas'vre for +5pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Crisis Shas'vre",
      "is_unique_per_army": false
    },
    {
      "header": "A Shas'vre may buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": TAU_DRONE_CHOICES,
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire"
  ],
  "unit_type": "Jump Pack Infantry, Monstrous Infantry",
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
  "default_size": 2,
  "min_cost": 74
};
