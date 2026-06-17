/**
 * VAMPIRE — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const vampire: Unit = {
  "name": "Vampire",
  "models": [
    {
      "name": "Vampire",
      "points": 878,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "5",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Vampire Raider is equipped with: Scatter laser; 2 twin pulse lasers.",
  "weapons": [
    {
      "name": "Phoenix missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Phoenix missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
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
      "name": "Twin pulsar - Saturation",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Barrage"
    },
    {
      "name": "Twin pulsar - Salvo",
      "range": "48\"",
      "type": "Heavy 6",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4)"
    },
    {
      "name": "Twin pulse laser",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap both twin pulse lasers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Phoenix missile launchers and a Twin pulsar",
          "points": 347
        }
      ],
      "replaces": [
        "Twin pulse laser"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus, Fast, Hover Mode",
    "Improved Holo-fields: The model gains a 4+ invulnerability save.",
    "Transport: This model has a transport capacity of 30 infantry models. When equipped with Pulsars and Phoenix missile launchers, it has a transport capacity of 0 infantry models."
  ],
  "unit_type": "Super-heavy Flyer, Vehicle",
  "keywords": [
    "Lord of War"
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
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 878
};
