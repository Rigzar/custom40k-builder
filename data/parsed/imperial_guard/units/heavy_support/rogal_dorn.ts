/**
 * ROGAL DORN — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const rogalDorn: Unit = {
  "name": "Rogal Dorn",
  "models": [
    {
      "name": "Rogal Dorn",
      "points": 531,
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
  "equipped_with": "A Rogal Dorn is equipped with: Castigator gatling cannon; Heavy stubber; Oppressor cannon with Co-axial autocannon.",
  "weapons": [
    {
      "name": "Castigator gatling cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Co-axial Autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
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
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
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
      "name": "Oppressor cannon",
      "range": "90\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(4), Barrage"
    },
    {
      "name": "Pulveriser cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Twin Battle cannon",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Oppressor cannon with Co-axial autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin Battle cannon",
          "points": 30
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Castigator gatling cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Pulveriser cannon",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one of the following weapons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Heavy stubbers",
          "points": 23
        },
        {
          "name": "two Meltas",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one of the following weapons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Heavy bolters",
          "points": 27
        },
        {
          "name": "two Multi-meltas",
          "points": 55
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
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 531
};
