/**
 * RAVENWING BLACK KNIGHTS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ravenwingBlackKnights: Unit = {
  "name": "Ravenwing Black Knights",
  "models": [
    {
      "name": "Black Knight",
      "points": 80,
      "min": 2,
      "max": 5,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Huntsmaster",
      "points": 85,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bolt pistol; Corvus hammer; Frag grenades; Krak grenades; Plasma talon.",
  "weapons": [
    {
      "name": "Corvus hammer",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1), Armor piercing(5+)"
    },
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
      "name": "Plasma talon",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Ravenwing Grenade launcher (Frag)",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Ravenwing Grenade launcher (Krak)",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ravenwing Grenade launcher (Rad)",
      "range": "12\"",
      "type": "Assault 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ravenwing Grenade launcher (Stasis)",
      "range": "12\"",
      "type": "Assault 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For each three models, one Black Knight may swap its Plasma talon",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Ravenwing Grenade launcher",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Outflank, Terrain Expert, They Shall Know No Fear, Vanguard",
    "Rad Poisoning: An enemy unit hit by a Rad grenade reduces its Toughness by -1 until the end of this unit's activation.",
    "Stasis Anomaly: An enemy unit hit by a Stasis grenade reduces its Ballistic Skill and Weapon Skill by -1 until the end of this unit's activation."
  ],
  "unit_type": "Bike",
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
  "default_size": 3,
  "min_cost": 245
};
