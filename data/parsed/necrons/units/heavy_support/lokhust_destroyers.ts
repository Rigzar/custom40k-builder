/**
 * LOKHUST DESTROYERS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lokhustDestroyers: Unit = {
  "name": "Lokhust Destroyers",
  "models": [
    {
      "name": "Destroyer",
      "points": 108,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "2",
        "A": "1",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Destroyer is equipped with: Gauss cannon.",
  "weapons": [
    {
      "name": "Enmitic exterminator",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "Barrage"
    },
    {
      "name": "Gauss cannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "Gauss"
    },
    {
      "name": "Heavy gauss cannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "Any Destroyer can swap their Gauss cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Enmitic exterminator",
          "points": 8
        },
        {
          "name": "Heavy gauss cannon",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Gauss cannon"]
    }
  ],
  "abilities": [
    "Reanimation Protocols"
  ],
  "unit_type": "Jet Bike, Necron",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 108
};
