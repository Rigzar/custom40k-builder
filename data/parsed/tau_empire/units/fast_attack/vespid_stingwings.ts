/**
 * VESPID STINGWINGS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const vespidStingwings: Unit = {
  "name": "Vespid Stingwings",
  "models": [
    {
      "name": "Stingwing",
      "points": 20,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "5",
        "SV": "5+"
      }
    },
    {
      "name": "Strain Leader",
      "points": 25,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Neutron blaster.",
  "weapons": [
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
      "name": "Neutron blaster",
      "range": "12\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Neutron grenade launcher",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-2",
      "d": "2",
      "abilities": "Explosive"
    },
    {
      "name": "Neutron rail rifle",
      "range": "30\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, one Stingwing may swap their Neutron blaster",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Flamer",
          "points": -4
        },
        {
          "name": "Neutron grenade launcher",
          "points": 11
        },
        {
          "name": "Neutron rail rifle",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire"
  ],
  "unit_type": "Jump Pack Infantry",
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
  "slot": "Fast Attack",
  "default_size": 4,
  "min_cost": 85
};
