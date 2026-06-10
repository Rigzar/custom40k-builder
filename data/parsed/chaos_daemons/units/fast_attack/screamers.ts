/**
 * SCREAMERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const screamers: Unit = {
  "name": "Screamers",
  "models": [
    {
      "name": "Screamer",
      "points": 44,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Warp jaws.",
  "weapons": [
    {
      "name": "Warp jaws",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Shred"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Tzeentch, Terrifying(-1)",
    "Slashing Dive: If the unit moves over an enemy unit with any command, that unit receives two automatic hits per Screamer with the Warp jaws profile."
  ],
  "unit_type": "Jet Bike",
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
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 132
};
