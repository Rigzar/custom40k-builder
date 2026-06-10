/**
 * VALKYRIE — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const valkyrie: Unit = {
  "name": "Valkyrie",
  "models": [
    {
      "name": "Valkyrie",
      "points": 223,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Valkyrie is equipped with: Multilaser.",
  "weapons": [
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Hellstrike missiles",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    },
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Multi-laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Multiple rocket pod",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Multi-laser",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Lascannon",
          "points": 50
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Multiple rocket pod",
          "points": 21
        },
        {
          "name": "2 Hellstrike missiles",
          "points": 108
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with two Heavy bolters for +36 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 36,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Hover mode",
    "Transport: This model has a transport capacity of 12 infantry models."
  ],
  "unit_type": "Flyer, Vehicle",
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
  "min_cost": 223
};
