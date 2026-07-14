/**
 * KABALITE TRUEBORN — Elites
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Kabalite Trueborn". NEW unit in 1.01.
 * Kabal veteran squad: a fixed Dracon champion + 4-19 Trueborn. One unit per Dracon (HQ)
 * selection; the Trueborn archetype lifts that limit and makes it count as Troops.
 * Weapon profiles are the shared Kabalite set (identical to Kabalite Warriors).
 */

import type { Unit } from '../../../../../src/types/data';

export const kabaliteTrueborn: Unit = {
  "name": "Kabalite Trueborn",
  "models": [
    {
      "name": "Trueborn",
      "points": 15,
      "min": 4,
      "max": 19,
      "stats": {
        "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "3", "W": "1", "I": "5", "A": "2", "LD": "8", "SV": "4+"
      }
    },
    {
      "name": "Dracon",
      "points": 20,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "3", "W": "1", "I": "5", "A": "3", "LD": "8", "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Splinter rifle.",
  "weapons": [
    { "name": "Blaster", "range": "18\"", "type": "Assault 1", "s": "8", "ap": "-4", "d": "2", "abilities": "AT(2), Lance(+1)" },
    { "name": "Dark lance", "range": "36\"", "type": "Heavy 1", "s": "8", "ap": "-4", "d": "3", "abilities": "AT(3), Lance(+2)" },
    { "name": "Shredder", "range": "18\"", "type": "Assault 1", "s": "6", "ap": "-1", "d": "1", "abilities": "Explosive, Suppression" },
    { "name": "Splinter cannon", "range": "36\"", "type": "Assault 4", "s": "3", "ap": "0", "d": "1", "abilities": "Poison(3+)" },
    { "name": "Splinter rifle", "range": "24\"", "type": "Rapid Fire 1", "s": "2", "ap": "0", "d": "1", "abilities": "Poison(3+)" }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, two Trueborn may swap their Splinter rifle",
      "constraint": { "type": "per_n", "per_n": 5, "count_per_n": 2 },
      "choices": [
        { "name": "Shredder", "points": 13 },
        { "name": "Blaster", "points": 29 }
      ],
      "inline_pts": null, "variant_link": null, "is_unique_per_army": false
    },
    {
      "header": "For each 10 models, two Trueborn may swap their Splinter rifle",
      "constraint": { "type": "per_n", "per_n": 10, "count_per_n": 2 },
      "choices": [
        { "name": "Splinter cannon", "points": 18 },
        { "name": "Dark lance", "points": 53 }
      ],
      "inline_pts": null, "variant_link": null, "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Power through Pain",
    "For every Dracon (HQ) selection, the army may include one Kabalite Trueborn unit."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Kabal"
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
  "min_cost": 80
};
