/**
 * SKORPIUS DISINTEGRATOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skorpiusDisintegrator: Unit = {
  "name": "Skorpius Disintegrator",
  "models": [
    {
      "name": "Skorpius Disintegrator",
      "points": 309,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "11",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Skorpius Disintegrator is equipped with: Belleros energy cannon; 3 Cognis heavy stubbers; Disruptor missile launcher.",
  "weapons": [
    {
      "name": "Belleros energy cannon",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
    },
    {
      "name": "Cognis heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Cognis"
    },
    {
      "name": "Disruptor missile launcher",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "Anti-air, AT(1), Explosive"
    },
    {
      "name": "Ferrumite cannon",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Belleros energy cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ferrumite cannon",
          "points": 59
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 309
};
