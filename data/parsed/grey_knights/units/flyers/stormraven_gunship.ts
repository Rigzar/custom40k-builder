/**
 * STORMRAVEN GUNSHIP — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and Fortitude."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const stormravenGunship: Unit = {
  "name": "Stormraven Gunship",
  "models": [
    {
      "name": "Stormraven Gunship",
      "points": 482,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
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
  "equipped_with": "A Stormraven Gunship is equipped with: 2 Stormstrike missile launchers; Twin heavy bolters; Twin assault cannon.",
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
      "abilities": "AT(2)"
    },
    {
      "name": "Twin multi-melta",
      "range": "24\"",
      "type": "Pistol 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Twin heavy psycannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(2), Shield breaker(-1)"
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
      "abilities": "Anti-Air, AT(2)"
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
          "name": "Twin heavy psycannon",
          "points": 0
        },
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
          "name": "Twin heavy psycannon",
          "points": 21
        },
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
    "Aegis(5+), Anti-Grav, Hover mode, Shrouding",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and Fortitude.",
    "Transport: This model has a transport capacity of 10 infantry models and 1 Dreadnought."
  ],
  "unit_type": "Flyer, Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 482
};
