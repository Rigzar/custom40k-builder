/**
 * FIRESTRIKE SERVO-TURRET — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const firestrikeServoTurret: Unit = {
  "name": "Firestrike Servo-turret",
  "models": [
    {
      "name": "Firestrike Servo-turret",
      "points": 144,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "0\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Twin accelerator autocannon.",
  "weapons": [
    {
      "name": "Twin accelerator autocannon",
      "range": "48\"",
      "type": "Assault 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Suppression"
    },
    {
      "name": "Twin las-talon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "9",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "Every model may swap their Twin accelerator autocannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin las-talon",
          "points": 117
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron, They Shall Know No Fear"
  ],
  "unit_type": "Monstrous Infantry",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 144
};
