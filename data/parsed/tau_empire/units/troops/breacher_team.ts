/**
 * BREACHER TEAM — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';
import { TAU_DRONE_CHOICES } from '../../drone_choices';

export const breacherTeam: Unit = {
  "name": "Breacher Team",
  "models": [
    {
      "name": "Fire Warrior",
      "points": 17,
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
      "name": "Fire Warrior Shas'la",
      "points": 17,
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
      "name": "Fire Warrior Shas'ui",
      "points": 22,
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
  "equipped_with": "All Fire Warriors and the Fire Warrior Shas'la are equipped with: Photon grenades; Pulse blaster; Pulse pistol.",
  "weapons": [
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
      "name": "Pulse pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "0",
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
      "header": "The Fire Warrior Shas'la may be upgraded to a Shas'ui for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Fire Warrior Shas'ui",
      "is_unique_per_army": false
    },
    {
      "header": "A Shas'ui may buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
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
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 85
};
