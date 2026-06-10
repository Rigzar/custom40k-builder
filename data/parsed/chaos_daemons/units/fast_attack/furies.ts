/**
 * FURIES — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const furies: Unit = {
  "name": "Furies",
  "models": [
    {
      "name": "Fury",
      "points": 16,
      "min": 10,
      "max": 30,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "4",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Daemonic claws.",
  "weapons": [
    {
      "name": "Daemonic claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Terrifying(-1)",
    "Prey on the weak: Everytime an enemy unit within 12\" fails a Leadership test, one model of the unit is slain. Character models and Monstrous Creatures are unaffected."
  ],
  "unit_type": "Jump Pack Infantry",
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
  "default_size": 10,
  "min_cost": 160
};
