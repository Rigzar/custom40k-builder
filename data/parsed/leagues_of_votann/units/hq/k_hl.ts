/**
 * KÂHL — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kHl: Unit = {
  "name": "Kâhl",
  "models": [
    {
      "name": "Kâhl",
      "points": 59,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
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
      "name": "High Kâhl",
      "points": 74,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Kâhl is a character model and equipped with: Gravitic concussion grenades.",
  "weapons": [
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
      "header": "One Kâhl per army can be upgraded to a High Kâhl for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "High Kâhl",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Steady Advance, Void armor",
    "Grim Efficiency: When activating this unit, select one enemy unit on the battlefield. It gains a Judgement token.",
    "High Kâhl: The model can use \"Grim Efficiency\" twice per battle round."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "min_cost": 59
};
