/**
 * WAVE SERPENT — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const waveSerpent: Unit = {
  "name": "Wave Serpent",
  "models": [
    {
      "name": "Wave Serpent",
      "points": 274,
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
  "equipped_with": "A Wave Serpent is equipped with: Twin scatter laser; Twin shuriken catapult.",
  "weapons": [
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
      "name": "Twin bright lance",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Twin scatter laser",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Twin shuriken cannon",
      "range": "24\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
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
      "name": "Twin starcannon",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Twin Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Twin scatter laser",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin shuriken cannon",
          "points": 2
        },
        {
          "name": "Twin Aeldari missile launcher",
          "points": 43
        },
        {
          "name": "Twin starcannon",
          "points": 61
        },
        {
          "name": "Twin bright lance",
          "points": 74
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
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
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Battle Focus",
    "Transport: This model has a transport capacity of 12 infantry models.",
    "Wave Serpent Shield: The model has a 5+ invulnerability save."
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 274
};
