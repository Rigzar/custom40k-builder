/**
 * PATHFINDER TEAM — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';
import { TAU_DRONE_CHOICES } from '../../drone_choices';

export const pathfinderTeam: Unit = {
  "name": "Pathfinder Team",
  "models": [
    {
      "name": "Pathfinder",
      "points": 26,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Pathfinder Shas'la",
      "points": 26,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Pathfinder Shas'ui",
      "points": 31,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "All models are equipped with: Markerlight; Photon grenades; Pulse carbine; Pulse pistol.",
  "weapons": [
    {
      "name": "Markerlight",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "Markerlight"
    },
    {
      "name": "Photon grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "1",
      "ap": "0",
      "d": "1",
      "abilities": "Blind"
    },
    {
      "name": "Pulse carbine",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Pulse pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Rail rifle",
      "range": "30\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Ion rifle - Standard",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Ion rifle - Overcharged",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Semi-automatic grenade launcher - Fusion grenade",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(3), Armorbane"
    },
    {
      "name": "Semi-automatic grenade launcher - EMP grenade",
      "range": "18\"",
      "type": "Assault 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Haywire"
    }
  ],
  "option_groups": [
    {
      "header": "Up to three models may swap their Markerlight and Pulse carbine",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Ion rifle",
          "points": 0
        },
        {
          "name": "Rail rifle",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Markerlight", "Pulse carbine"]
    },
    {
      "header": "One model with a Pulse carbine may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Semi-automatic grenade launcher",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Pathfinder Shas'la may be upgraded to a Shas'ui for +5pts and gains access to the armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Pathfinder Shas'ui",
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
    "Infiltrator, Supporting Fire, Vanguard"
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 130
};
