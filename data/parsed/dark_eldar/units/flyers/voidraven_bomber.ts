/**
 * VOIDRAVEN BOMBER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const voidravenBomber: Unit = {
  "name": "Voidraven Bomber",
  "models": [
    {
      "name": "Voidraven Bomber",
      "points": 254,
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
        "I": "5",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Voidraven Bomber is equipped with: 2 Dark scythes; Void mine.",
  "weapons": [
    {
      "name": "Dark scythe",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Void lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Void mine",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Bomb, Explosive"
    },
    {
      "name": "Voidraven missiles",
      "range": "48\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Barrage"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace its two Dark scythes",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Two Void lances",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with Voidraven missiles for +51 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 51,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with a Flickerfield for +41 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 41,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
  "unit_type": "Flyer",
  "keywords": [
    "Coven, Cult, Kabal"
  ],
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
