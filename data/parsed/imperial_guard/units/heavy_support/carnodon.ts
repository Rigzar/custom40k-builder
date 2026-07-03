/**
 * CARNODON — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const carnodon: Unit = {
  "name": "Carnodon",
  "models": [
    {
      "name": "Carnodon",
      "points": 209,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Carnodon is equipped with: 2 Heavy bolters; Twin Multilaser.",
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
      "abilities": "AT(2)"
    },
    {
      "name": "Multilaser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
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
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin multilaser",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Volkite caliver",
      "range": "30\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Deadly(5+)"
    },
    {
      "name": "Volkite culverin",
      "range": "45\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Deadly(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Twin multilaser",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin autocannon",
          "points": 12
        },
        {
          "name": "Volkite culverin",
          "points": 18
        },
        {
          "name": "Twin lascannon",
          "points": 75
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap both Heavy bolters",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin multilaser",
          "points": 2
        },
        {
          "name": "two Volkite calivers",
          "points": 3
        },
        {
          "name": "two Heavy flamers",
          "points": 8
        },
        {
          "name": "two Autocannons",
          "points": 13
        },
        {
          "name": "two Lascannons",
          "points": 77
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
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
  "min_cost": 209
};
