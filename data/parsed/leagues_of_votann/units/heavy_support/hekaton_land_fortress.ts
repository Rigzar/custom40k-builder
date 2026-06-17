/**
 * HEKATON LAND FORTRESS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hekatonLandFortress: Unit = {
  "name": "Hekaton Land Fortress",
  "models": [
    {
      "name": "Hekaton Land Fortress",
      "points": 393,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "13",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hekaton Land Fortress is a single model and equipped with: MATR autocannon; Pan spectral scanner; SP heavy conversion beamer; 2 Twin bolt cannons.",
  "weapons": [
    {
      "name": "Ancestor's vengeance warhead",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Ammo(1), Haywire, Indirect"
    },
    {
      "name": "Cyclic ion cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Heavy magna-rail cannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "4",
      "abilities": "AT(4), Beam, Decimate, Tank hunter"
    },
    {
      "name": "Kin's wrath warhead",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Ammo(1), Explosive, Indirect"
    },
    {
      "name": "MATR autocannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Mountain breaker warhead",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-3",
      "d": "4",
      "abilities": "Ammo(1), AT(4), Indirect, Lance(1)"
    },
    {
      "name": "Twin bolt cannon",
      "range": "36\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin ion beamer",
      "range": "18\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Beam"
    },
    {
      "name": "SP heavy conversion beamer - Short range",
      "range": "1\" - 10\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Barrage"
    },
    {
      "name": "SP heavy conversion beamer - Mid range",
      "range": "11\" - 20\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "SP heavy conversion beamer - Long range",
      "range": "21\" - 30\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the SP heavy conversion beamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Cyclic ion cannon",
          "points": 17
        },
        {
          "name": "Heavy magna-rail cannon",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace each Twin bolt cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin ion beamer",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace the Pan spectral scanner",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ancestor's vengeance warhead",
          "points": 0
        },
        {
          "name": "Kin's wrath warhead",
          "points": 10
        },
        {
          "name": "Mountain breaker warhead",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Void armor",
    "Pan spectral scanner: All weapons of the unit gain +1 AP when shooting at targets that benefit from cover.",
    "Transport: This model has a transport capacity of 12 infantry models."
  ],
  "unit_type": "Vehicle",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 393
};
