/**
 * STORMRAVEN GUNSHIP — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormravenGunship: Unit = {
  "name": "Stormraven Gunship",
  "models": [
    {
      "name": "Stormraven Gunship",
      "points": 472,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Stormraven Gunship is a single model and equipped with: 2 Stormstrike missile launchers; Twin heavy bolter; Twin assault cannon.",
  "weapons": [
    {
      "name": "Hurricane Bolter",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Stormstrike missile launcher",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "3",
      "abilities": "Anti-Air, AT(2)"
    },
    {
      "name": "Twin assault cannon",
      "range": "24\"",
      "type": "Heavy 8",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin multi-melta",
      "range": "24\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Twin plasma cannon (Standard)",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Twin plasma cannon (Overcharged)",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    },
    {
      "name": "Typhoon missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Typhoon missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Twin assault cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin lascannon",
          "points": 74
        },
        {
          "name": "Twin plasma cannon",
          "points": 132
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace the Twin heavy bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin multi-melta",
          "points": 37
        },
        {
          "name": "Typhoon missile launcher",
          "points": 45
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with 2 Hurricane bolters for +64 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 64,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Hover mode",
    "Transport: This model has a transport capacity of 10 infantry models and 1 Dreadnought."
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 472
};
