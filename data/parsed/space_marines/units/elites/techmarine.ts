/**
 * TECHMARINE — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const techmarine: Unit = {
  "name": "Techmarine",
  "models": [
    {
      "name": "Techmarine",
      "points": 140,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Master of the Forge",
      "points": 155,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "equipped_with": "A Techmarine is equipped with: Grav pistol; Omnissiah-Power axe; Forge bolter; Servo arm; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Forge bolter",
      "range": "24\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Extra attack"
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
      "name": "Grav pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Grav"
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
      "name": "Omnissiah power axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Servo arm",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Extra attack, Slow(-5)"
    }
  ],
  "option_groups": [
    {
      "header": "One Techmarine per army can be upgraded to a Master of the Forge for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Master of the Forge",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Command squad, They Shall Know No Fear",
    "Advisor: For every HQ selection, one Techmarine may be selected without taking up an Elite slot.",
    "Blessing of the Omnissiah: At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a wound or armor penetration roll.",
    "Master of the Forge: A Master of the Forge may use \"Blessing of the Omnissiah\" two times per battle round. Additionally, he counts as a HQ selections and fills up a slot, respectively."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 140
};
