/**
 * GRIMNYR — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const grimnyr: Unit = {
  "name": "Grimnyr",
  "models": [
    {
      "name": "Grimnyr",
      "points": 72,
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
        "SV": "4+"
      }
    },
    {
      "name": "CORV",
      "points": 15,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Ancient Grimnyr",
      "points": 87,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Grimnyr is equipped with: Gravitic concussion grenades.\nEach CORV is equipped with: Autoch-pattern bolter.",
  "weapons": [
    {
      "name": "Autoch-pattern bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    }
  ],
  "option_groups": [
    {
      "header": "One Grimnyr per army can be upgraded to an Ancient Grimnyr for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Ancient Grimnyr",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Steady Advance, Void armor",
    "Ancient Grimnyr: The model can cast and deny 1 additional power per battle round.",
    "Companions: CORVs do not prevent a Grimnyr from joining another unit and do not count towards passenger capacity in a transport.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 72
};
