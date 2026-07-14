/**
 * HAEMOXYTES — Elites
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Haemoxytes". NEW unit in 1.01.
 * Coven veteran squad: a fixed Haemoxyte Acothyst champion + 4-19 Haemoxyte. One unit per
 * Haemonculus (HQ) selection; the Haemoxytes archetype lifts that limit and makes it Troops.
 * Weapon profiles are the shared Wrack set.
 */

import type { Unit } from '../../../../../src/types/data';

export const haemoxytes: Unit = {
  "name": "Haemoxytes",
  "models": [
    {
      "name": "Haemoxyte",
      "points": 13,
      "min": 4,
      "max": 19,
      "stats": {
        "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "4", "W": "1", "I": "4", "A": "2", "LD": "8", "SV": "6+"
      }
    },
    {
      "name": "Haemoxyte Acothyst",
      "points": 18,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "4", "W": "1", "I": "4", "A": "3", "LD": "8", "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Wrack blades.",
  "weapons": [
    { "name": "Liquifier gun", "range": "9\"", "type": "Assault 4", "s": "4", "ap": "-2", "d": "1", "abilities": "Flames" },
    { "name": "Ossefactor", "range": "24\"", "type": "Assault 1", "s": "2", "ap": "-3", "d": "2", "abilities": "Poison(2+)" },
    { "name": "Wrack blades", "range": "-", "type": "Melee", "s": "U", "ap": "-1", "d": "1", "abilities": "Poison(3+)" }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, two Haemoxytes may be equipped with",
      "constraint": { "type": "per_n", "per_n": 5, "count_per_n": 2 },
      "choices": [
        { "name": "Liquifier gun", "points": 15 },
        { "name": "Ossefactor", "points": 23 }
      ],
      "inline_pts": null, "variant_link": null, "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Power through Pain",
    "Further transformed shape: The unit starts with two \"Power through Pain\" tokens.",
    "For every Haemonculus selection, the army may include one Haemoxytes unit."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Coven"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 70
};
