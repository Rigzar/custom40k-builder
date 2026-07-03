/**
 * MALCADOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const malcador: Unit = {
  "name": "Malcador",
  "models": [
    {
      "name": "Malcador",
      "points": 223,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "11",
        "I": "3",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Malcador is equipped with: 2 Heavy stubbers.",
  "weapons": [
    {
      "name": "Autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
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
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
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
      "name": "Inferno gun - Chem cannon",
      "range": "18\"",
      "type": "Heavy 12",
      "s": "1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames, Poison(3+)"
    },
    {
      "name": "Inferno gun - Inferno cannon",
      "range": "18\"",
      "type": "Heavy 12",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Inferno gun - Melta cannon",
      "range": "30\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Explosive, Melta"
    }
  ],
  "option_groups": [
    {
      "header": "Must equip a turret weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "four Heavy bolters",
          "points": 54
        },
        {
          "name": "Vanquisher battle cannon",
          "points": 93
        },
        {
          "name": "Twin lascannon",
          "points": 104
        },
        {
          "name": "Inferno gun",
          "points": 156
        },
        {
          "name": "Battle cannon",
          "points": 163
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with a rump weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 14
        },
        {
          "name": "Autocannon",
          "points": 20
        },
        {
          "name": "Lascannon",
          "points": 52
        },
        {
          "name": "Demolisher battle cannon",
          "points": 170
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap both Heavy stubbers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Heavy bolters",
          "points": 5
        },
        {
          "name": "two Heavy flamers",
          "points": 12
        },
        {
          "name": "two Autocannon",
          "points": 18
        },
        {
          "name": "two Lascannons",
          "points": 81
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infernus: If an Inferno gun is selected as the turret weapon, no other rump weapon may be taken.",
    "Lumbering Behemoth: The model may not receive an \"Advance\" order. Additionally, it always counts as having received a \"Stand & Shoot\" order when shooting its weapons."
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 223
};
