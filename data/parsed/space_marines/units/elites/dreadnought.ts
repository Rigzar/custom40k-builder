/**
 * DREADNOUGHT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const dreadnought: Unit = {
  "name": "Dreadnought",
  "models": [
    {
      "name": "Dreadnought",
      "points": 144,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dreadnought is a single model and equipped with: -.",
  "weapons": [
    {
      "name": "Assault cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Dreadnought claw",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Flurry(1), Shred"
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
      "name": "Frag cannon",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+), Suppression"
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
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
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
    },
    {
      "name": "Twin autocannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
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
      "name": "Missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Plasma cannon (Standard)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma cannon (Overcharged)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Must pick two weapons from this list",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Dreadnought claw with Storm bolter",
          "points": 18
        },
        {
          "name": "Dreadnought close combat weapon with Storm bolter",
          "points": 27
        },
        {
          "name": "Assault cannon",
          "points": 32
        },
        {
          "name": "Frag cannon",
          "points": 32
        },
        {
          "name": "Twin heavy bolter",
          "points": 36
        },
        {
          "name": "Multi-melta",
          "points": 37
        },
        {
          "name": "Missile launcher",
          "points": 41
        },
        {
          "name": "Seismic hammer with Heavy flamer",
          "points": 42
        },
        {
          "name": "Twin autocannon",
          "points": 53
        },
        {
          "name": "Plasma cannon",
          "points": 98
        },
        {
          "name": "Twin lascannon",
          "points": 138
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can swap a Storm bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 2
        },
        {
          "name": "Melta",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron",
    "Furioso: If the model has two melee weapons, it gains +2 attacks."
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
  "min_cost": 144
};
