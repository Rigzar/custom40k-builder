/**
 * DESTROYER TANK HUNTER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const destroyerTankHunter: Unit = {
  "name": "Destroyer Tank Hunter",
  "models": [
    {
      "name": "Destroyer",
      "points": 328,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "4+",
        "S": "7",
        "FRONT": "14",
        "SIDE": "12",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Destroyer is equipped with: Laser Destroyer.",
  "weapons": [
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
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Laser Destroyer",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "4",
      "abilities": "AT(4), Lance(1), Tank hunter"
    },
    {
      "name": "Twin-linked heavy stubber",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "May take a secondary weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 14
        },
        {
          "name": "Twin-linked heavy stubber",
          "points": 23
        },
        {
          "name": "Lascannon",
          "points": 52
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush: Attacks with the Laser Destroyer are resolved at BS 3+, if used with an actual \"Stand & Shoot\" order. Lumbering Behemoth does not count for this effect.",
    "Lumbering Behemoth: The model may not receive an \"Advance\" order. Additionally, it always counts as having received a \"Stand & Shoot\" order when shooting its weapons."
  ],
  "unit_type": "Squadron, Vehicle",
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
  "is_squadron": true,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 328
};
