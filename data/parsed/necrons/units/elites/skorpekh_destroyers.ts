/**
 * SKORPEKH DESTROYERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skorpekhDestroyers: Unit = {
  "name": "Skorpekh Destroyers",
  "models": [
    {
      "name": "Destroyer",
      "points": 48,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Hyperphase threshers.",
  "weapons": [
    {
      "name": "Hyperphase reap-blade",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Flurry(2), Slow(-1)"
    },
    {
      "name": "Hyperphase threshers",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 3 Destroyers, one Destroyer may swap their Hyperphase threshers",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Hyperphase reap-blade",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Hyperphase threshers"]
    }
  ],
  "abilities": [
    "Massive(1), Move through cover, Reanimation Protocols"
  ],
  "unit_type": "Infantry, Necron",
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
  "min_cost": 144
};
