/**
 * RAVAGER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ravager: Unit = {
  "name": "Ravager",
  "models": [
    {
      "name": "Ravager",
      "points": 248,
      "min": 1,
      "max": 2,
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
  "equipped_with": "A Ravager is equipped with: 3 Disintegrator cannons.",
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
      "header": "Can replace each Disintegrator cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Dark lance",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with a Flickerfield for +42 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 42,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Squadron",
    "Aerial assault: The unit may fire all ranged weapons if it moved up to 12\".",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORD to the unit."
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 248
};
