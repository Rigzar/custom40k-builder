/**
 * IRONCLAD DREADNOUGHT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ironcladDreadnought: Unit = {
  "name": "Ironclad Dreadnought",
  "models": [
    {
      "name": "Dreadnought",
      "points": 216,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dreadnought is a single model and equipped with: Dreadnought close combat weapon with Storm bolter; Seismic hammer with Heavy flamer.",
  "weapons": [
    {
      "name": "Dreadnought chainfist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Armorbane"
    },
    {
      "name": "Dreadnought close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Flamestorm cannon",
      "range": "12\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Hurricane Boltgun",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Seismic hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Haywire"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can swap the Storm bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can swap the Heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Melta",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can swap the Dreadnought close combat weapon with Storm bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hurricane Boltgun",
          "points": 5
        },
        {
          "name": "Flamestorm cannon",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can swap the Seismic hammer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Dreadnought chainfist",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to two Hunter-killer missiles from the Armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron",
    "Furioso: If the model has two melee weapons, it gains +2 attacks.",
    "Ironclad Assault Launchers: Enemy units do not gain any bonus for charging this model."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 216
};
