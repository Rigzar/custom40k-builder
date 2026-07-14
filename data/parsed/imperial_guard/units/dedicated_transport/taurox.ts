/**
 * TAUROX — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const taurox: Unit = {
  "name": "Taurox",
  "models": [
    {
      "name": "Taurox",
      "points": 120,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Taurox is equipped with: 2 Hot-shot volley guns.",
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
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Hot-shot volley gun",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "3",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
      "name": "Taurox battle cannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Taurox gatling cannon",
      "range": "24\"",
      "type": "Heavy 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Taurox missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Taurox missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with one of the following weapons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Taurox gatling cannon",
          "points": 36
        },
        {
          "name": "Taurox battle cannon",
          "points": 73
        },
        {
          "name": "Taurox missile launcher",
          "points": 81
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap both Hot-shot volley guns",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Autocannons",
          "points": 29
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
          "name": "Storm bolter",
          "points": 11
        },
        {
          "name": "Heavy stubber",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Fire hatches(2)",
    "Transport: This model has a transport capacity of 10 infantry models."
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 120
};
