/**
 * HAMMERFALL BUNKER — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hammerfallBunker: Unit = {
  "name": "Hammerfall Bunker",
  "models": [
    {
      "name": "Hammerfall Bunker",
      "points": 290,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "0\"",
        "WS": "-",
        "BS": "4+",
        "S": "-",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "-",
        "A": "-",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hammerfall Bunker is a single model and equipped with: Hammerstrike missile launcher; 2 Heavy bolter arrays.",
  "weapons": [
    {
      "name": "Heavy bolter array",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer array",
      "range": "9\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the 2 Heavy bolter arrays",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Heavy flamer arrays",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy bolter array"]
    }
  ],
  "abilities": [
    "Deep Strike",
    "Control Jets: The unit must land at least 6\" away from other units (friendly or enemy) and can never stray closer than 6\" to another unit, terrain, or the edge of the field. Reduce the deviation only enough to place the model."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 290
};
