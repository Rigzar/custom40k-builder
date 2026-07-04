/**
 * HAZARD BATTLESUITS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';
import { TAU_DRONE_CHOICES } from '../../drone_choices';

export const hazardBattlesuits: Unit = {
  "name": "Hazard Battlesuits",
  "models": [
    {
      "name": "Hazard Shas'ui",
      "points": 72,
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
      "name": "Hazard Shas'vre",
      "points": 77,
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
  "equipped_with": "All models are equipped with: 2 Pulse submunition rifles.",
  "weapons": [
    {
      "name": "Fusion cascade",
      "range": "12\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(1)"
    },
    {
      "name": "Pulse submunition rifle",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Barrage, Seeking"
    },
    {
      "name": "Twin burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Phased ion gun - Standard",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Phased ion gun - Overcharged",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap each Pulse submunition rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Phased ion gun",
          "points": 4
        },
        {
          "name": "Twin burst cannon",
          "points": 7
        },
        {
          "name": "Fusion cascade",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true,
      "replaces": ["Pulse submunition rifle"]
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
      "header": "One Hazard Shas'ui may be upgraded to a Shas'vre for +5pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Hazard Shas'vre",
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
  "slot": "Fast Attack",
  "default_size": 2,
  "min_cost": 144
};
