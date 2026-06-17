/**
 * HAEMONCULUS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const haemonculus: Unit = {
  "name": "Haemonculus",
  "models": [
    {
      "name": "Haemonculus",
      "points": 28,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Master Haemonculus",
      "points": 43,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "A Haemonculus is equipped with: Plasma grenade.",
  "weapons": [
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "One Haemonculus per army can be upgraded to a Master Haemonculus for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Master Haemonculus",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Power through Pain",
    "Master Haemonculus: A Master Haemonculus starts with an additional \"Power through Pain\" token.",
    "Transformed shape: The unit starts with a \"Power through Pain\" token."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Coven"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 28
};
