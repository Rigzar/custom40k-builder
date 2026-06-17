/**
 * MEKBOY — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const mekboy: Unit = {
  "name": "Mekboy",
  "models": [
    {
      "name": "Mekboy",
      "points": 31,
      "min": 1,
      "max": 2,
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
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Stikkbombz.",
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
    "Command squad, Dakka Dakka Dakka, Furious charge, Mob, Squadron, Waaagh!",
    "Advisor: For every HQ selection, one Mekboy may be selected without taking up an Elite slot.",
    "Mek tools:  At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a woand or armor penetration roll."
  ],
  "unit_type": "Character Model, Infantry",
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 31
};
