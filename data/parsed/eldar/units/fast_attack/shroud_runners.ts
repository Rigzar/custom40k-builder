/**
 * SHROUD RUNNERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const shroudRunners: Unit = {
  "name": "Shroud Runners",
  "models": [
    {
      "name": "Shroud Runner",
      "points": 75,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "2+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Ranger long rifle; Scatter laser; Shuriken pistol.",
  "weapons": [
    {
      "name": "Ranger long rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(4+), Suppression"
    },
    {
      "name": "Scatter laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Shuriken pistol",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Battle Focus, Use cover"
  ],
  "unit_type": "Jetbike",
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
  "default_size": 3,
  "min_cost": 225
};
