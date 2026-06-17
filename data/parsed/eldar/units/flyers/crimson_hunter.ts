/**
 * CRIMSON HUNTER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const crimsonHunter: Unit = {
  "name": "Crimson Hunter",
  "models": [
    {
      "name": "Crimson Hunter Exarch",
      "points": 388,
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
  "variant_models": [
    {
      "name": "Crimson Hunter Exarch",
      "points": 443,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "2+",
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
  "equipped_with": "A Crimson Hunter is equipped with: Pulse laser; 2 Starcannons.",
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
      "name": "Pulse laser",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    },
    {
      "name": "Starcannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +55 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 55,
      "variant_link": "Crimson Hunter Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "May swap both Starcannons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Bright lances",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can gain one Exarch Power.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus, Deflect",
    "Vector dancer: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Flyer",
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
  "min_cost": 388
};
