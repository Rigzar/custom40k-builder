/**
 * SAGITAUR — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sagitaur: Unit = {
  "name": "Sagitaur",
  "models": [
    {
      "name": "Sagitaur",
      "points": 249,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "12",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Sagitaur is equipped with: L7 missile launcher; twin bolt cannon.",
  "weapons": [
    {
      "name": "HYLas beam cannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Beam"
    },
    {
      "name": "L7 missile launcher",
      "range": "30\"",
      "type": "Assault 7",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "MATR autocannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Sagitaur missile launcher",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-3",
      "d": "3",
      "abilities": "Anti-Air, AT(3)"
    },
    {
      "name": "Twin bolt cannon",
      "range": "36\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the L7 missile launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "MATR autocannon",
          "points": 23
        },
        {
          "name": "HYLas beam cannon",
          "points": 55
        },
        {
          "name": "Sagitaur missile launcher",
          "points": 73
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Void armor",
    "Transport: This model has a transport capacity of 6 infantry models, excluding models in Exo-armor and Exo-frames."
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 249
};
