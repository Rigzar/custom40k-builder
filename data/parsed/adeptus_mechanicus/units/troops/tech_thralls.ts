/**
 * TECH THRALLS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const techThralls: Unit = {
  "name": "Tech Thralls",
  "models": [
    {
      "name": "Tech-thrall",
      "points": 9,
      "min": 10,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "2",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each Tech-thrall is equipped with: Laslock.",
  "weapons": [
    {
      "name": "Chainblade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Laslock",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Mitralock",
      "range": "12\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "All models may swap their Laslock",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Chainblade",
          "points": 0
        },
        {
          "name": "Mitralock",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Monotask, Unyielding",
    "Bionics: This model receives a 6+ invulnerability save."
  ],
  "unit_type": "Infantry",
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
  "slot": "Troops",
  "default_size": 10,
  "min_cost": 90
};
