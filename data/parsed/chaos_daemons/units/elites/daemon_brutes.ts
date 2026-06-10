/**
 * DAEMON BRUTES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const daemonBrutes: Unit = {
  "name": "Daemon Brutes",
  "models": [
    {
      "name": "Daemon Brute",
      "points": 56,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Immaterial armaments.",
  "weapons": [
    {
      "name": "Immaterial armaments",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), Slow(-2)"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a Mark of Chaos (points per model)",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 2
        },
        {
          "name": "Slaanesh",
          "points": 2
        },
        {
          "name": "Nurgle",
          "points": 2
        },
        {
          "name": "Tzeentch",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bodyguard, Daemon, Daemonic instability, Terrifying(-1)"
  ],
  "unit_type": "Monstrous Infantry",
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
  "min_cost": 168
};
