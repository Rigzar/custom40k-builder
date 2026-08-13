/**
 * STAFF OFFICER — Elites
 *
 * SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Staff Officer".
 */

import type { Unit } from '../../../../../src/types/data';

export const staffOfficer: Unit = {
  "variant_models": [],
  "weapons": [
    {
      "name": "Las pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
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
  "advisor": true,
  "unit_type": "Character Model, Infantry",
  "slot": "Elites",
  "default_size": 1,
  "name": "Staff Officer",
  "models": [
    {
      "name": "Staff Officer",
      "points": 18,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "A Staff Officer is equipped with: Las pistol.",
  "abilities": [
    "Command Squad",
    "Advisor: For each HQ selection, one Staff Officer may be selected that does not occupy an Elite slot.",
    "Planner: You may re-roll one die during each Reinforcement phase."
  ],
  "min_cost": 18
};
