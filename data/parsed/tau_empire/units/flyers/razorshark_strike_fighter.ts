/**
 * RAZORSHARK STRIKE FIGHTER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const razorsharkStrikeFighter: Unit = {
  "name": "Razorshark Strike Fighter",
  "models": [
    {
      "name": "Razorshark Strike Fighter",
      "points": 273,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Razorshark Strike Fighter is a single model and equipped with: Burst cannon; Quad ion turret; 2 Seeker missiles.",
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
      "name": "Missile pod",
      "range": "30\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Seeker missile",
      "range": "120\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), Anti-Air, AT(2)"
    },
    {
      "name": "Quad ion turret - Standard",
      "range": "30\"",
      "type": "Rapid Fire 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Quad ion turret - Overcharged",
      "range": "30\"",
      "type": "Rapid Fire 4",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace its Burst cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Missile pod",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire"
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 273
};
