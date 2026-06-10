/**
 * BEASTS OF NURGLE — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const beastsOfNurgle: Unit = {
  "name": "Beasts of Nurgle",
  "models": [
    {
      "name": "Beast of Nurgle",
      "points": 61,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "2",
        "A": "4",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Putrid appendages.",
  "weapons": [
    {
      "name": "Putrid appendages",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Poison(4+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Nurgle, Terrifying(-1)",
    "Attention seeker: The unit can move an additional 6\" if it charges an enemy unit which is already in close combat."
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
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 61
};
