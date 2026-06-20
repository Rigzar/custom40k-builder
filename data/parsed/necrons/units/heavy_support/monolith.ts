/**
 * MONOLITH — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const monolith: Unit = {
  "name": "Monolith",
  "models": [
    {
      "name": "Monolith",
      "points": 594,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "3+",
        "S": "7",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "2",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Monolith is a single model and equipped with: Four Gauss flux arcs; Teleport homer; Particle whip.",
  "weapons": [
    {
      "name": "Gauss flux arc",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Particle whip",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(4), Barrage, Suppression, Tank hunter"
    },
    {
      "name": "Death ray",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(4)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the four Gauss flux arcs",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Death ray",
          "points": 148
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Gauss flux arc"]
    }
  ],
  "abilities": [
    "Anti-Grav, Deep strike",
    "Gate of Eternity: Instead of using its particle whip, a Monolith can teleport a friendly <Necron> unit to it. Remove the target unit from the battlefield and redeploy it within 3\" of the Monolith.",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Lumbering: The model can never move more than 6\". If it arrives via Deep strike from reserve and would land on top of an enemy unit, move all models as little as possible to make room for the Monolith."
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
  "min_cost": 594
};
