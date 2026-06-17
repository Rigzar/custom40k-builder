/**
 * VENOM — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const venom: Unit = {
  "name": "Venom",
  "models": [
    {
      "name": "Venom",
      "points": 174,
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
  "equipped_with": "A Venom is a single model and equipped with: Bladevanes; Splinter cannon; Twin splinter rifle.",
  "weapons": [
    {
      "name": "Bladevanes",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Unwieldy"
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
      "header": "Can replace its Twin splinter rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Splinter cannon",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
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
    "Transport: This model has a transport capacity of 6 infantry models.",
    "Vector Strike: Any unit this model overflows takes an automatic hit with its melee weapon profile."
  ],
  "unit_type": "Vehicle",
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 174
};
