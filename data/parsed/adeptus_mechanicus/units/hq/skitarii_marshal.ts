/**
 * SKITARII MARSHAL — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skitariiMarshal: Unit = {
  "name": "Skitarii Marshal",
  "models": [
    {
      "name": "Skitarii Marshal",
      "points": 35,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Skitarii Marshal is equipped with: -.",
  "weapons": [],
  "option_groups": [],
  "abilities": [
    "Canticles of the Omnissiah, Command squad",
    "Advisor: For every HQ selection, one Skitarii Marshal may be selected without taking up an HQ slot.",
    "Servo-skull Uplink: The model and its attached unit may re-roll one to hit and one to wound roll each battle round."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 35
};
