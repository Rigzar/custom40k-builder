/**
 * STOMPA — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stompa: Unit = {
  "name": "Stompa",
  "models": [
    {
      "name": "Stompa",
      "points": 492,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "10",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "12",
        "I": "3",
        "A": "3",
        "HP": "8"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Stompa is equipped with: -.",
  "weapons": [
    {
      "name": "Big shoota",
      "range": "36\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Deff kannon",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Colossal blast, Tank hunter"
    },
    {
      "name": "Flakka gunz",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-air, Explosive, Sunder(1)"
    },
    {
      "name": "Flamebelcha",
      "range": "12\"",
      "type": "Assault 8",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Flames"
    },
    {
      "name": "Gaze of Mork",
      "range": "60\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-5",
      "d": "4",
      "abilities": "AT(4), Beam, Tank Hunter"
    },
    {
      "name": "Gigashoota",
      "range": "48\"",
      "type": "Heavy 18",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Deflagrate(6+)"
    },
    {
      "name": "Grot bomm",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo (1), AT(2), Barrage, Indirect, Grot-guided"
    },
    {
      "name": "Lifta-droppa",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Armorbane, Explosive, Grav, Lifta"
    },
    {
      "name": "Mega-choppa - Strike",
      "range": "-",
      "type": "Melee",
      "s": "D",
      "ap": "-5",
      "d": "4",
      "abilities": "AT(4), Flurry(1)"
    },
    {
      "name": "Mega-choppa - Sweep",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Flurry(4)"
    },
    {
      "name": "Megadeff Rolla",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Flurry(12)"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Skorcha",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Supa-skorcha",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Supa rokkit",
      "range": "120\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage"
    },
    {
      "name": "Supa-gatler",
      "range": "48\"",
      "type": "Heavy 20",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "Ammo(2), AT(1)"
    },
    {
      "name": "Twin-linked big shoota",
      "range": "36\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin-linked rokkit launcha",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Must be equipped with two arm weapons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Mega-choppa",
          "points": 58
        },
        {
          "name": "Lifta-droppa",
          "points": 81
        },
        {
          "name": "Megadeff Rolla and two Supa-skorchas (counts as two arm weapons)",
          "points": 226
        },
        {
          "name": "Deff kannon",
          "points": 264
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must be equipped with one support weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gaze of Mork",
          "points": 59
        },
        {
          "name": "Supa-gatler",
          "points": 59
        },
        {
          "name": "Flamebelcha",
          "points": 73
        },
        {
          "name": "Two Flakka gunz",
          "points": 80
        },
        {
          "name": "Gigashoota",
          "points": 96
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one belly gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Deff kannon",
          "points": 244
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to five of the following weapons",
      "constraint": {
        "type": "fixed_max",
        "max": 5
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 12
        },
        {
          "name": "Rokkit launcha",
          "points": 16
        },
        {
          "name": "Skorcha",
          "points": 22
        },
        {
          "name": "Twin-linked big shoota",
          "points": 23
        },
        {
          "name": "Twin-linked rokkit launcha",
          "points": 31
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to three Supa rokkits for +23 points each",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        { "name": "Supa rokkit", "points": 23 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to three Grot bomms for +34 points each",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        { "name": "Grot bomm", "points": 34 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Fire hatches(4), Waaagh!",
    "Effigy: Friendly models within 12\" with the \"Mob\" rule are fearless.",
    "Grot riggers: Roll 1D6 at the start of each activation for each destroyed weapon or permanent engine damage. On a 5+ that weapon or damage is repaired.",
    "Transport: This model has a transport capacity of 20 infantry models, unless it has a belly gun.",
    "Ramshackle: Roll D6 after the vehicle loses its last Hull Point — 1-3: Big Kaboom! The vehicle explodes with a 12\" radius. 4-6: Kareen! Move the vehicle 3D6\" in a random direction and then perform Big Kaboom!; on a hit symbol the controlling player decides the direction. If the vehicle has been reduced to 0\" Movement permanently, the controlling player may roll on this table with any command during their next activation and apply the result."
  ],
  "unit_type": "Super-heavy Walker",
  "keywords": [
    "Lord of War"
  ],
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
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 492
};
