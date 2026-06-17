/**
 * COMMANDER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const commander: Unit = {
  "name": "Commander",
  "models": [
    {
      "name": "Shas'el Commander",
      "points": 81,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Shas'o Commander",
      "points": 96,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "3",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Shas'el is a single character model and equipped with: -.",
  "weapons": [
    {
      "name": "Airbursting fragmentation projector",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Indirect, Suppression"
    },
    {
      "name": "Burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Fusion blaster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(3)"
    },
    {
      "name": "High-intensity plasma rifleˣ",
      "range": "24\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "High-output burst cannonˣ",
      "range": "18\"",
      "type": "Rapid Fire 5",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Missile pod",
      "range": "30\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Plasma rifle",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Cyclic ion blasterˣ - Standard",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Cyclic ion blasterˣ - Overcharged",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with up to two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 5
        },
        {
          "name": "Airbursting fragmentation projector",
          "points": 10
        },
        {
          "name": "Burst cannon",
          "points": 12
        },
        {
          "name": "Plasma rifle",
          "points": 19
        },
        {
          "name": "High-output burst cannonˣ",
          "points": 27
        },
        {
          "name": "Missile pod",
          "points": 28
        },
        {
          "name": "Fusion blaster",
          "points": 34
        },
        {
          "name": "High-intensity plasma rifleˣ",
          "points": 45
        },
        {
          "name": "Cyclic ion blasterˣ",
          "points": 53
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Shas'el per army can be upgraded to a Shas'o for +15 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Shas'o Commander",
      "is_unique_per_army": false
    },
    {
      "header": "May pick up to two SUPPORT SYSTEMS from the armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire",
    "Crisis bodyguard: The Commander may join a unit of Crisis Honor Guard.",
    "Shas'o: May be equipped with one additional weapon and SUPPORT SYSTEM each."
  ],
  "unit_type": "Jump Pack Infantry, Monstrous Infantry",
  "keywords": [],
  "is_vehicle": false,
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 81
};
