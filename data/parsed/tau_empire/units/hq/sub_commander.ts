/**
 * SUB-COMMANDER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';
import { TAU_DRONE_CHOICES } from '../../drone_choices';

export const subCommander: Unit = {
  "name": "Sub-Commander",
  "models": [
    {
      "name": "Sub-Commander",
      "points": 37,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Sub-Commander is a single character model and equipped with: Photon grenades; Pulse rifle; Pulse pistol.",
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
      "name": "Pulse rifle",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Pulse blaster - Short range",
      "range": "9\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Pulse blaster - Long range",
      "range": "15\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every unit of Commander or Ethereal, one Sub-Commander unit may be taken without using a HQ slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be upgraded to one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Cadre Fireblade",
          "points": 5
        },
        {
          "name": "Darkstrider",
          "points": 5
        },
        {
          "name": "Longstrike",
          "points": 50
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Pulse rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Pulse carbine",
          "points": 1
        },
        {
          "name": "Pulse blaster",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "May take a Markerlight for +10 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
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
    "Command squad, Squadron, Supporting Fire",
    "Upgrades:",
    "Cadre Fireblade: All ranged weapons of the Cadre Fireblade and its attached unit gain the \"Deflagrate(6+)\" ability.",
    "Darkstrider: All Markerlights of Darkstrider and his attached unit gain +6\" range. Darkstrider has the \"Infiltrator\" and \"Vanguard\" ability.",
    "Longstrike: The model must start the game inside a Hammerhead unit (even though the vehicle does not have a transport capacity!) and can't disembark until it is destroyed. The Hammerhead that is chosen improves its Ballistic Skill by +1."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 37
};
