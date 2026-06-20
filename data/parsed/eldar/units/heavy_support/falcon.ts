/**
 * FALCON — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const falcon: Unit = {
  "name": "Falcon",
  "models": [
    {
      "name": "Falcon",
      "points": 320,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "5",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Falcon is equipped with: Pulse laser; Scatter laser; Twin shuriken catapult.",
  "weapons": [
    {
      "name": "Bright lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Pulse laser",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    },
    {
      "name": "Scatter laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Starcannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin shuriken catapult",
      "range": "18\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Scatter laser",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 1
        },
        {
          "name": "Aeldari missile launcher",
          "points": 22
        },
        {
          "name": "Starcannon",
          "points": 30
        },
        {
          "name": "Bright lance",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Scatter laser"]
    },
    {
      "header": "May swap the Twin shuriken catapult",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin shuriken catapult"]
    }
  ],
  "abilities": [
    "Anti-Grav, Battle Focus, Deep strike",
    "Cloudstrike: The model scatters only 1D6\" when being deployed via Deep strike.",
    "Transport: This model has a transport capacity of 6 infantry models."
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
  "min_cost": 320
};
