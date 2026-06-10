/**
 * BURNING CHARIOT — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const burningChariot: Unit = {
  "name": "Burning Chariot",
  "models": [
    {
      "name": "Burning Chariot",
      "points": 262,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "5+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Fire of Tzeentch, Warp jaws.",
  "weapons": [
    {
      "name": "Warp jaws",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Fire of Tzeentch - Blue fire",
      "range": "18\"",
      "type": "Assault 3",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Fire of Tzeentch - Pink fire",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Tzeentch, Squadron, Terrifying(-1)"
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 262
};
