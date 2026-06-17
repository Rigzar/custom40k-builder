/**
 * TETRAS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tetras: Unit = {
  "name": "Tetras",
  "models": [
    {
      "name": "Tetra",
      "points": 90,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "12\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "4",
        "W": "3",
        "I": "2",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: 2 Twin markerlights; Twin pulse rifle.",
  "weapons": [
    {
      "name": "Twin markerlight",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "Markerlight"
    },
    {
      "name": "Twin pulse rifle",
      "range": "30\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may pick up to two SUPPORT SYSTEMS from the armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire, Vanguard"
  ],
  "unit_type": "Jetbike",
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 90
};
