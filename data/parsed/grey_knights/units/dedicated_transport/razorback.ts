/**
 * RAZORBACK — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and Fortitude."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const razorback: Unit = {
  "name": "Razorback",
  "models": [
    {
      "name": "Razorback",
      "points": 142,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Razorback is equipped with: Twin heavy bolter.",
  "weapons": [
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin assault cannon",
      "range": "24\"",
      "type": "Heavy 8",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "-"
    },
    {
      "name": "Twin heavy psycannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(2), Shield breaker(-1)"
    },
    {
      "name": "Twin plasma gun (Standard)",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin plasma gun (Overheating)",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Twin heavy bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin assault cannon",
          "points": 28
        },
        {
          "name": "Twin heavy psycannon",
          "points": 45
        },
        {
          "name": "Lascannon and Twin plasma gun",
          "points": 77
        },
        {
          "name": "Twin lascannon",
          "points": 102
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with a Storm bolter for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Aegis(5+), Shrouding",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and Fortitude.",
    "Transport: This model has a transport capacity of 6 infantry models. It can't transport models in Terminator armor."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 142
};
