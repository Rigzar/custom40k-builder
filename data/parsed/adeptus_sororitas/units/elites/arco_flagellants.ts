/**
 * ARCO-FLAGELLANTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const arcoFlagellants: Unit = {
  "name": "Arco-flagellants",
  "models": [
    {
      "name": "Arco-flagellant",
      "points": 13,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Arco flail.",
  "weapons": [
    {
      "name": "Arco flail",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Berserk(5+), Blind rage",
    "Concession: One unit of Arco-flagellants can be selected for each Preacher that does not occupy an Elite slot."
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
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 39
};
