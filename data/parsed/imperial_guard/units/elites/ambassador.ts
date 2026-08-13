/**
 * AMBASSADOR — Elites
 *
 * SOURCE: Imperial Guard 1.03 (sheet fetched 2026-08-13), "Ambassador".
 */

import type { Unit } from '../../../../../src/types/data';

export const ambassador: Unit = {
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
  "name": "Ambassador",
  "models": [
    {
      "name": "Ambassador",
      "points": 17,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "An Ambassador is equipped with: Las pistol.",
  "abilities": [
    "Command squad",
    "Advisor: For each HQ selection, one Ambassador may be selected that does not occupy an Elite slot.",
    "Diplomatic Ruse: After all units have been placed in the Deployment phase, the you may remove and redeploy one of your units."
  ],
  "min_cost": 17
};
