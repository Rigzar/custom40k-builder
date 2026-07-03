/**
 * HELLHOUNDS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hellhounds: Unit = {
  "name": "Hellhounds",
  "models": [
    {
      "name": "Hellhound",
      "points": 207,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hellhound is equipped with: Inferno cannon; Heavy bolter.",
  "weapons": [
    {
      "name": "Chem cannon",
      "range": "12\"",
      "type": "Heavy 6",
      "s": "1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames, Poison(3+)"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Inferno cannon",
      "range": "12\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Melta cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Explosive, Melta"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Inferno cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Chem cannon",
          "points": 0
        },
        {
          "name": "Melta cannon",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Heavy bolter",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Fast, Squadron",
    "Explosive ammunition container: If the Hellhound is destroyed, it explodes automatically. The explosion range is 6\" and the automatic hit is handled with the profile of the turret weapon."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 207
};
