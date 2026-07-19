/**
 * FIENDS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fiends: Unit = {
  "name": "Fiends",
  "models": [
    {
      "name": "Fiend",
      "points": 42,
      "min": 2,
      "max": 5,
      "stats": {
        "M": "14\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "5",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Blissbringer",
      "points": 42,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "14\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "5",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Dissecting claws.",
  "weapons": [
    {
      "name": "Dissecting claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Deflect, Daemon, Daemonic instability, Mark of Slaanesh, Terrifying(-1)"
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
  "locked_mark": "Slaanesh",
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 126
};
