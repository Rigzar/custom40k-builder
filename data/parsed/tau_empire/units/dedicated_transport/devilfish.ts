/**
 * DEVILFISH — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const devilfish: Unit = {
  "name": "Devilfish",
  "models": [
    {
      "name": "Devilfish",
      "points": 213,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Devilfish is a single model and equipped with: Burst cannon; Two Twin pulse carbines.",
  "weapons": [
    {
      "name": "Burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Smart missile system",
      "range": "30\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Seeking"
    },
    {
      "name": "Twin pulse carbine",
      "range": "24\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace both Twin pulse carbines",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Two burst cannons",
          "points": 0
        },
        {
          "name": "two Smart missile systems",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin pulse carbine"]
    }
  ],
  "abilities": [
    "Anti-Grav, Supporting Fire",
    "Transport: This model has a transport capacity of 12 models."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 213
};
