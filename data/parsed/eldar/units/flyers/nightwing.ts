/**
 * NIGHTWING — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const nightwing: Unit = {
  "name": "Nightwing",
  "models": [
    {
      "name": "Nightwing",
      "points": 343,
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
  "equipped_with": "A Nightwing is equipped with: Twin bright lance; Twin shuriken cannon.",
  "weapons": [
    {
      "name": "Twin bright lance",
      "range": "36\"",
      "type": "Heavy 1",
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
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Battle Focus, Deflect",
    "Interceptor: All ranged attacks of the model gain the \"Anti-Air\" ability.",
    "Vector Dancer: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 343
};
