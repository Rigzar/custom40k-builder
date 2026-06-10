/**
 * FLAMERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const flamers: Unit = {
  "name": "Flamers",
  "models": [
    {
      "name": "Flamer",
      "points": 54,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "5+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Flickering flames.",
  "weapons": [
    {
      "name": "Flickering flames",
      "range": "12\"",
      "type": "Assault 4",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Tzeentch, Terrifying(-1)"
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
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 162
};
