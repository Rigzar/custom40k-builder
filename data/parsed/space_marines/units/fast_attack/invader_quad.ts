/**
 * INVADER-QUAD — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const invaderQuad: Unit = {
  "name": "Invader-Quad",
  "models": [
    {
      "name": "Invader-Quad",
      "points": 143,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Heavy bolt pistol; Frag grenades; Krak grenades; Onslaught gatling cannon, Twin bolt rifle.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Heavy bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
      "name": "Onslaught gatling cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Twin bolt rifle (Bolt ammo)",
      "range": "30\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin bolt rifle (Stalker ammo)",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin bolt rifle (Assault ammo)",
      "range": "24\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Every model may swap their Onslaught gatling cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Multi-melta",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron, They Shall Know No Fear"
  ],
  "unit_type": "Bike",
  "keywords": [],
  "is_vehicle": false,
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 143
};
