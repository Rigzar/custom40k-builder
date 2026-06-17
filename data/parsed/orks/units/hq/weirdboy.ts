/**
 * WEIRDBOY — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle roand. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const weirdboy: Unit = {
  "name": "Weirdboy",
  "models": [
    {
      "name": "Weirdboy",
      "points": 58,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "4"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Warphead",
      "points": 73,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Weirdboy is equipped with: Stikkbombz.",
  "weapons": [
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "One Weirdboy per army can be upgraded to a Warphead for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Warphead",
      "is_unique_per_army": true
    },
    {
      "header": "Can get one Kustom job.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Mob, Furious charge, Waaagh!",
    "Psyker: The model can cast 1 power and deny 1 power per battle roand. It knows Smite and all powers from a chosen discipline.",
    "Waaagh! energy: The model gains a +1 bonus to manifest and deny psychic powers as long as there are 20 or more models with the \"Mob\" rule within 12\" of it.",
    "Warphead: The model can cast and deny 1 additional power per battle roand."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 58
};
