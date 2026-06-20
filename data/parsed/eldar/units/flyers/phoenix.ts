/**
 * PHOENIX — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const phoenix: Unit = {
  "name": "Phoenix",
  "models": [
    {
      "name": "Phoenix",
      "points": 571,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "5",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Phoenix is equipped with: 2 Phoenix missile launchers; Pulse laser; Twin shuriken cannon.",
  "weapons": [
    {
      "name": "Pulse laser",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
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
      "name": "Twin shuriken cannon",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-air, Shuriken"
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
      "name": "Phoenix missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Phoenix missile launcher - Starshot",
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
      "header": "May swap the Pulse laser",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin starcannon",
          "points": 12
        },
        {
          "name": "Twin bright lance",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Pulse laser"]
    }
  ],
  "abilities": [
    "Battle Focus, Deflect",
    "Vector Dancer: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 571
};
