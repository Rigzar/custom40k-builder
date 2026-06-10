/**
 * APOTHECARY — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const apothecary: Unit = {
  "name": "Apothecary",
  "models": [
    {
      "name": "Apothecary",
      "points": 51,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Chief Apothecary",
      "points": 66,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Apothecarius is a single character and equipped with: Frag grenades; Krak grenades.",
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "One Apothecary per army can be upgraded to a Chief Apothecary for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Chief Apothecary",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Command squad, They Shall Know No Fear",
    "Advisor: For every HQ selection, one Apothecarius may be selected without taking up an Elite slot.",
    "Chief Apothecary: A Chief Apothecary may use \"Narthecium\" two times per battle round. Additionally, he counts as a HQ selections and fills up a slot, respectively.",
    "Narthecium: Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above."
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
  "min_cost": 51
};
