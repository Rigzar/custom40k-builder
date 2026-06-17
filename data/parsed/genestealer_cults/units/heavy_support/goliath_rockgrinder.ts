/**
 * GOLIATH ROCKGRINDER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const goliathRockgrinder: Unit = {
  "name": "Goliath Rockgrinder",
  "models": [
    {
      "name": "Goliath Rockgrinder",
      "points": 225,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "The model is equipped with: Heavy stubber; Heavy seismic cannon.",
  "weapons": [
    {
      "name": "Cache of demolition charges",
      "range": "6\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage, Seeking"
    },
    {
      "name": "Clearance incinerator",
      "range": "15\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heavy mining laser",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Explosive"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Heavy seismic cannon - Long-wave",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Heavy seismic cannon - Short-wave",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with a Cache of demolition charges for +15 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap its Heavy seismic cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Clearance incinerator",
          "points": 4
        },
        {
          "name": "Heavy mining laser",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Infiltrator, Use cover",
    "Drilldozer blade: The model's Tank Shock attacks are resolved at Strength 8.",
    "Transport: This model has a transport capacity of 6 infantry models."
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 225
};
