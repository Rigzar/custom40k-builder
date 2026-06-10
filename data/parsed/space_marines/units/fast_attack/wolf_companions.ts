/**
 * WOLF COMPANIONS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wolfCompanions: Unit = {
  "name": "Wolf Companions",
  "models": [
    {
      "name": "Wolf Companion",
      "points": 6,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Claws & Teeth.",
  "weapons": [
    {
      "name": "Claws & Teeth",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "They Shall Know No Fear"
  ],
  "unit_type": "Bike",
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
  "default_size": 1,
  "min_cost": 6
};
