/**
 * WASPS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wasps: Unit = {
  "name": "Wasps",
  "models": [
    {
      "name": "Wasp",
      "points": 122,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "5",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Wasp is equipped with: 2 Scatter lasers.",
  "weapons": [
    {
      "name": "Bright lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Scatter laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Starcannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap first Scatter laser",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 1
        },
        {
          "name": "Aeldari missile launcher",
          "points": 22
        },
        {
          "name": "Starcannon",
          "points": 30
        },
        {
          "name": "Bright lance",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Scatter laser"]
    },
    {
      "header": "May swap second Scatter laser",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 1
        },
        {
          "name": "Aeldari missile launcher",
          "points": 22
        },
        {
          "name": "Starcannon",
          "points": 30
        },
        {
          "name": "Bright lance",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Scatter laser"]
    }
  ],
  "abilities": [
    "Battle Focus, Deep Strike, Squadron",
    "Jump Jet: When this model executes an Advance or Charge order, it gets +6\" to its movement and the Anti-Grav rule."
  ],
  "unit_type": "Walker",
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
  "slot": "Troops",
  "default_size": 1,
  "min_cost": 122
};
