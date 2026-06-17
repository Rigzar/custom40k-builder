/**
 * WRAITHKNIGHT — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wraithknight: Unit = {
  "name": "Wraithknight",
  "models": [
    {
      "name": "Wraithknight",
      "points": 492,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "10",
        "T": "10",
        "W": "9",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Wraithknight is equipped with: Scatter shield; Sword of Vaul.",
  "weapons": [
    {
      "name": "Heavy wraithcannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4), Explosive, Graviton"
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
      "name": "Suncannon",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Sword of Vaul - Strike",
      "range": "-",
      "type": "Melee",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4)"
    },
    {
      "name": "Sword of Vaul - Sweep",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Scatter shield and Sword of Vaul",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Heavy wraithcannons",
          "points": 160
        },
        {
          "name": "Scatter shield and Suncannon",
          "points": 264
        }
      ],
      "replaces": [
        "Scatter shield",
        "Sword of Vaul"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Scatter laser",
          "points": 19
        },
        {
          "name": "Shuriken cannon",
          "points": 20
        },
        {
          "name": "Starcannon",
          "points": 49
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus, Deflect, Fearless, Parry",
    "Scatter shield: The model gains a 4+ invulnerability save.",
    "Wraithbone: Reduces AP of enemy attacks by -1 (to a minimum of 0)."
  ],
  "unit_type": "Gargantuan Creature",
  "keywords": [
    "Lord of War",
    "Wraith"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 492
};
