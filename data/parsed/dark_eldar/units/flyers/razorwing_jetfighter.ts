/**
 * RAZORWING JETFIGHTER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const razorwingJetfighter: Unit = {
  "name": "Razorwing Jetfighter",
  "models": [
    {
      "name": "Razorwing Jetfighter",
      "points": 274,
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
  "equipped_with": "A Razorwing Jetfighter is equipped with: 2 Disintegrator cannons; 2 Razorwing missiles; Twin splinter rifle.",
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
    },
    {
      "name": "Monoscythe missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Rending(5+)"
    },
    {
      "name": "Necrotoxin missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Poison(2+)"
    },
    {
      "name": "Shatterfield missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "AT(1), Seeking, Soul burn(5+)"
    },
    {
      "name": "Splinter cannon",
      "range": "36\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Twin splinter rifle",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace its two Disintegrator cannons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Two Dark lances",
          "points": 29
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace its Twin splinter rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Splinter cannon",
          "points": 6
        }
      ],
      "inline_pts": null,
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
    "Coven", "Cult", "Kabal"
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 274
};
