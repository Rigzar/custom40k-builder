/**
 * CORVUS BLACKSTAR — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const corvusBlackstar: Unit = {
  "name": "Corvus Blackstar",
  "models": [
    {
      "name": "Corvus Blackstar",
      "points": 341,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "11",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Corvus Blackstar is equipped with: Blackstar cluster launcher; Twin assault cannon; Twin Blackstar rocket launcher.",
  "weapons": [
    {
      "name": "Blackstar cluster launcher - Frag cluster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Bomb, Barrage"
    },
    {
      "name": "Blackstar cluster launcher - Infernus cluster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Bomb, Explosive, Sunder(1)"
    },
    {
      "name": "Hurricane bolt gun",
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
      "abilities": "Anti-air, AT(2)"
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
      "name": "Twin Blackstar rocket launcher - Corvid",
      "range": "30\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Anti-Air, Explosive"
    },
    {
      "name": "Twin Blackstar rocket launcher - Dracos",
      "range": "30\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Barrage, Seeking"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
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
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace the Twin Blackstar rocket launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Stormstrike missile launcher",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with one Hurricane bolt gun for +32 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 32,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Infernum Halo-launcher",
          "points": 5
        },
        {
          "name": "Auspex array",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Hover mode",
    "Assault ramp: Passengers can still make a 6\" charge move after the vehicle moves and they exit.",
    "Auspex array: All ranged weapons equipped by this vehicle gain the \"Sunder(1)\" ability.",
    "Infernum Halo-launcher: Enemy weapons do not get any bonus for \"Anti-Air\" abilities.",
    "Transport: This model has a transport capacity of 12 infantry models. Cannot transport models with the \"Massive\" ability."
  ],
  "unit_type": "Flyer, Vehicle",
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 341
};
