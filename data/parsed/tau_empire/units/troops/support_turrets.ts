/**
 * SUPPORT TURRETS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const supportTurrets: Unit = {
  "name": "Support Turrets",
  "models": [
    {
      "name": "Support Turret",
      "points": 41,
      "min": 1,
      "max": 5,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "4+",
        "S": "4",
        "FRONT": "9",
        "SIDE": "9",
        "REAR": "9",
        "I": "2",
        "A": "1",
        "HP": "1"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Support Turret is a single model and equipped with: Flamer.",
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
    },
    {
      "name": "Smart missile system",
      "range": "30\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Anti-Air, Indirect, Sunder(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Can only be selected if at least one other \"Troops\" unit is being taken. Can't be a mandatory unit selection.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each Support turret may swap its Flamer",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Airbursting fragmentation projector",
          "points": 1
        },
        {
          "name": "Smart missile system",
          "points": 4
        },
        {
          "name": "Burst cannon",
          "points": 5
        },
        {
          "name": "Plasma rifle",
          "points": 7
        },
        {
          "name": "Missile pod",
          "points": 14
        },
        {
          "name": "Fusion blaster",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire",
    "Deployment: Support Turrets always start in reserves and arrive whenever the controlling player wants to and in whatever quantity. Do not make reserve rolls for Support Turrets. During each Reinforcement phase, one Support Turret per Breacher or Strike Team can be placed anywhere within 3\" of any Breacher or Strike Team. If a Breacher or Strike team is currently transported within a Devilfish, the Support Turret can be placed within 3\" of the Devilfish. Support Turrets count as being completely immobilised after setup.",
    "Expanding the sphere of influence: If a Support Turret is placed on a mission objective that was secured by a Troop selection (via the \"Objective secured!\" ability), it will still control the mission objective, even if an enemy unit is standing on it. This means all Support Turrets on an objective need to be destroyed, before the enemy may capture or contest the point!"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "default_size": 1,
  "min_cost": 41
};
