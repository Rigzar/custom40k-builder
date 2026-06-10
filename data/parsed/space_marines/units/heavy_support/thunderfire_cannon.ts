/**
 * THUNDERFIRE CANNON — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const thunderfireCannon: Unit = {
  "name": "Thunderfire Cannon",
  "models": [
    {
      "name": "Thunderfire Cannon",
      "points": 230,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "7",
        "W": "4",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Thunderfire Cannon is a single character and equipped with: Bolt pistol; Flamer; Frag grenade; Krak grenade; Plasma cutter; 2 Servo arms; Thunderfire cannon.",
  "weapons": [
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
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
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
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
      "name": "Plasma cutter",
      "range": "12\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Servo arm",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Extra attack, Slow(-5)"
    },
    {
      "name": "Thunderfire cannon (Airburst)",
      "range": "60\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Seeking"
    },
    {
      "name": "Thunderfire cannon (Subterranian blast)",
      "range": "60\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    },
    {
      "name": "Thunderfire cannon (Surface detonation)",
      "range": "60\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Squadron, They Shall Know No Fear"
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "min_cost": 230
};
