/**
 * KROOT HOUNDS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootHounds: Unit = {
  "name": "Kroot Hounds",
  "models": [
    {
      "name": "Kroot hound",
      "points": 8,
      "min": 3,
      "max": 12,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Kroot hounds are equipped with: Ripping fangs.",
  "weapons": [
    {
      "name": "Ripping fangs",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every unit of Kroot Carnivores, one unit of Kroot Hounds may be taken without using a FAST ATTACK slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire, Use Cover"
  ],
  "unit_type": "Bike, Kroot",
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
  "min_cost": 24
};
