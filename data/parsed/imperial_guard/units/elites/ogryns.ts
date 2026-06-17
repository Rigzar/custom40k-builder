/**
 * OGRYNS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ogryns: Unit = {
  "name": "Ogryns",
  "models": [
    {
      "name": "Ogryn",
      "points": 43,
      "min": 2,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "6",
        "SV": "5+"
      }
    },
    {
      "name": "Ogryn Bone'ead",
      "points": 43,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Crude weapon; Frag bombs.",
  "weapons": [
    {
      "name": "Frag bomb",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Ripper gun (Melee)",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Ripper gun (Ranged)",
      "range": "12\"",
      "type": "Pistol 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Furious Charge, Massive(1)"
  ],
  "unit_type": "Infantry",
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
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 129
};
