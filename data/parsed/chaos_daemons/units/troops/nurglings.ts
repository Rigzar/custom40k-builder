/**
 * NURGLINGS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const nurglings: Unit = {
  "name": "Nurglings",
  "models": [
    {
      "name": "Nurgling Swarm",
      "points": 24,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "2",
        "T": "2",
        "W": "3",
        "I": "2",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Diseased claws and teeth.",
  "weapons": [
    {
      "name": "Diseased claws and teeth",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(4+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Infiltrator, Mark of Nurgle, Mindless, Use cover, Swarm"
  ],
  "unit_type": "Infantry",
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
  "slot": "Troops",
  "default_size": 3,
  "min_cost": 72
};
