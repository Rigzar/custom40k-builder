/**
 * MASTER OF ORDNANCE — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const masterOfOrdnance: Unit = {
  "name": "Master of Ordnance",
  "models": [
    {
      "name": "Master of Ordnance",
      "points": 227,
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
  "variant_models": [],
  "equipped_with": "A Master of Ordnance is equipped with: Artillery strike; Las pistol.",
  "weapons": [
    {
      "name": "Artillery strike",
      "range": "100\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Barrage, Indirect, Suppression"
    },
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
  "abilities": [
    "Command Squad",
    "Advisor: For each HQ selection, one Master of Ordnance may be selected that does not occupy an Elite slot.",
    "(In)accuracy: Artillery Strikes hit on a roll of 3+. This roll can never be modified.",
    "Priority bombardment: Only one Artillery strike can be used per turn."
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
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 227
};
