/**
 * COLOSSUS BOMBARD — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const colossusBombard: Unit = {
  "name": "Colossus Bombard",
  "models": [
    {
      "name": "Colossus",
      "points": 234,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Colossus is equipped with: Colossus siege cannon; Heavy bolter.",
  "weapons": [
    {
      "name": "Colossus siege cannon",
      "range": "240\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "Blast(8), Indirect, Seeking, Suppression(3)"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1)"
    },
    {
      "name": "Twin heavy stubber",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression(3)"
    }
  ],
  "option_groups": [
    {
      "header": "May take one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 4
        },
        {
          "name": "Twin heavy stubber",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Blast(8): A successful hit roll with this weapon generates 1 hit per model in the target unit, to a maximum of 8 hits. An unsuccessful hit roll can be re-rolled once and can only generate half (rounded down) that many maximum hits.",
    "Slow Firing: A Colossus Bombard may only fire its siege cannon with a Stand & Shoot order, even if it is not firing indirectly."
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
  "min_cost": 234
};
