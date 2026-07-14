/**
 * RAIDER — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const raider: Unit = {
  "name": "Raider",
  "models": [
    {
      "name": "Raider",
      "points": 172,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
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
  "equipped_with": "A Raider is equipped with: Disintegrator cannon.",
  "weapons": [
    {
      "name": "Dark lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Disintegrator cannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace its Disintegrator cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Dark lance",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Disintegrator cannon"]
    },
    {
      "header": "Can be equipped with a Flickerfield for +40 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 40,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Open",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORD to the unit.",
    "Transport: This model has a transport capacity of 11 infantry models."
  ],
  "unit_type": "Vehicle",
  "keywords": [
    "-"
  ],
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
  "min_cost": 172
};
