/**
 * ACHILLES RIDGERUNNERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const achillesRidgerunners: Unit = {
  "name": "Achilles Ridgerunners",
  "models": [
    {
      "name": "Achilles Ridgerunner",
      "points": 126,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "2",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: 2 Heavy stubbers; Heavy mortar.",
  "weapons": [
    {
      "name": "Achilles missile launcher",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-air, AT(1)"
    },
    {
      "name": "Heavy mining laser",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Explosive"
    },
    {
      "name": "Heavy mortar",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "May swap its Heavy mortar",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Achilles missile launcher",
          "points": 18
        },
        {
          "name": "Heavy mining laser",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy mortar"]
    }
  ],
  "abilities": [
    "Ambush, Infiltrator, Squadron, Use cover, Vanguard"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "default_size": 1,
  "min_cost": 126
};
