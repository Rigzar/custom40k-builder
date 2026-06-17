/**
 * LEMAN RUSS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lemanRuss: Unit = {
  "name": "Leman Russ",
  "models": [
    {
      "name": "Leman Russ",
      "points": 263,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "14",
        "SIDE": "13",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Leman Russ is equipped with: Punisher gatling cannon; Heavy bolter.",
  "weapons": [
    {
      "name": "Battle cannon",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage, Tank hunter"
    },
    {
      "name": "Demolisher battle cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Barrage, Tank hunter"
    },
    {
      "name": "Eradicator nova cannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Seeking"
    },
    {
      "name": "Exterminator autocannon",
      "range": "48\"",
      "type": "Heavy 8",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Suppression"
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
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
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
      "name": "Punisher gatling cannon",
      "range": "24\"",
      "type": "Heavy 10",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
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
      "name": "Vanquisher battle cannon",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "4",
      "abilities": "AT(4), Lance(2), Tank hunter"
    },
    {
      "name": "Executioner plasma cannon (Standard)",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Executioner plasma cannon (Overheating)",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
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
      "name": "Plasma cannon (Overheating)",
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
      "header": "May swap the Punisher gatling cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Eradicator nova cannon",
          "points": 0
        },
        {
          "name": "Exterminator autocannon",
          "points": 28
        },
        {
          "name": "Vanquisher battle cannon",
          "points": 33
        },
        {
          "name": "Twin lascannon",
          "points": 44
        },
        {
          "name": "Executioner plasma cannon",
          "points": 87
        },
        {
          "name": "Battle cannon",
          "points": 103
        },
        {
          "name": "Demolisher battle cannon",
          "points": 110
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with sponsons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Heavy bolters",
          "points": 27
        },
        {
          "name": "two Heavy flamers",
          "points": 35
        },
        {
          "name": "two Multi-meltas",
          "points": 55
        },
        {
          "name": "two Plasma cannons",
          "points": 147
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Heavy bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 4
        },
        {
          "name": "Lascannon",
          "points": 38
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Lumbering Behemoth: The model may not receive an \"Advance\" order. Additionally, it always counts as having received a \"Stand & Shoot\" order when shooting its weapons."
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
  "min_cost": 263
};
