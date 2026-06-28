/**
 * CRUSADERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const crusaders: Unit = {
  "name": "Crusaders",
  "models": [
    {
      "name": "Crusader",
      "points": 44,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Crusader is equipped with: Power sword; Storm shield.",
  "weapons": [
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Deflect, Parry, Squadron",
    "Concession: One unit of Crusaders can be selected for each Missionary or Preacher that does not occupy an Elite slot.",
    "Crusade: The model and its attached unit gain the \"Frenzy(1\")\" ability and roll 2D6 (pick highest) for the extra movement with an Advance order."
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
  "is_squadron": true,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 40
};
