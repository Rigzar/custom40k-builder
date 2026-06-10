/**
 * WHIRLWIND — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const whirlwind: Unit = {
  "name": "Whirlwind",
  "models": [
    {
      "name": "Whirlwind",
      "points": 159,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Whirlwind is a single model and equipped with: Whirlwind missile launcher.",
  "weapons": [
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Whirlwind missile launcher (Castellan)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect, Seeking, Suppression"
    },
    {
      "name": "Whirlwind missile launcher (Vengeance)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Indirect, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with an additional Storm bolter for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 159
};
