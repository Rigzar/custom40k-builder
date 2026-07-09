/**
 * REDEMPTOR DREADNOUGHT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const redemptorDreadnought: Unit = {
  "name": "Redemptor Dreadnought",
  "models": [
    {
      "name": "Redemptor Dreadnought",
      "points": 150,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "11",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Redemptor Dreadnought is equipped with: -.",
  "weapons": [
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
      "name": "Heavy onslaught gatling cannon",
      "range": "30\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Icarus rocket pod",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Onslaught gatling cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Redemptor claw",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(2)"
    },
    {
      "name": "Redemptor fist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Twin ironhail skytalon array",
      "range": "36\"",
      "type": "Heavy 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-air"
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
      "type": "Heavy 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Twin storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Macro plasma incinerator (Standard)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Macro plasma incinerator (Overheating)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Explosive, Overheating"
    },
    {
      "name": "Missile launcher - Frag",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher - Krak",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Must pick one weapon from this list",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Redemptor claw",
          "points": 19
        },
        {
          "name": "Redemptor fist and Storm bolter",
          "points": 27
        },
        {
          "name": "Redemptor fist and Heavy flamer",
          "points": 29
        },
        {
          "name": "Missile launcher",
          "points": 41
        },
        {
          "name": "Redemptor fist and Onslaught gatling cannon",
          "points": 53
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick one weapon from this list",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Redemptor claw",
          "points": 19
        },
        {
          "name": "Redemptor fist and Storm bolter",
          "points": 27
        },
        {
          "name": "Heavy onslaught gatling cannon",
          "points": 52
        },
        {
          "name": "Twin lascannon",
          "points": 138
        },
        {
          "name": "Macro plasma incinerator",
          "points": 203
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick one weapon from this list",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin storm bolter",
          "points": 21
        },
        {
          "name": "Twin heavy bolter",
          "points": 36
        },
        {
          "name": "Twin multi-melta",
          "points": 73
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick one weapon from this list",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Icarus rocket pod",
          "points": 35
        },
        {
          "name": "Twin ironhail skytalon array",
          "points": 61
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Furioso: If the model has two identical melee weapons, it gains +2 attacks."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 150
};
