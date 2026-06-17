/**
 * ARCHAEOPTER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const archaeopter: Unit = {
  "name": "Archaeopter",
  "models": [
    {
      "name": "Archaeopter",
      "points": 254,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Archaeopter is equipped with: 2 Cognis heavy stubbers; Twin-linked cognis heavy stubber.",
  "weapons": [
    {
      "name": "Cognis heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Cognis, Suppression"
    },
    {
      "name": "Heavy phosphor blaster",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Luminagen"
    },
    {
      "name": "Tectomagnic bomb rack",
      "range": "12\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(3), AT(2), Bomb, Explosive, Graviton"
    },
    {
      "name": "Twin-linked cognis heavy stubber",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Cognis, Suppression"
    },
    {
      "name": "Twin-linked cognis lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Cognis"
    }
  ],
  "option_groups": [
    {
      "header": "May swap both Cognis heavy stubbers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Heavy phosphor blasters",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May reduce its transport capacity to 0 and take",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Cognis heavy stubbers",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Twin-linked cognis heavy stubber",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Tectomagnic bomb rack",
          "points": 64
        },
        {
          "name": "Twin-linked cognis lascannon",
          "points": 108
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Hover mode, Vanguard",
    "Transport: This model has a transport capacity of 6 infantry models."
  ],
  "unit_type": "Flyer, Vehicle",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 254
};
