/**
 * LAND SPEEDER STORM — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const landSpeederStorm: Unit = {
  "name": "Land Speeder Storm",
  "models": [
    {
      "name": "Land Speeder Storm",
      "points": 135,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "2",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Land Speeder Storm is a single model and equipped with: Cerberus launcher; Heavy bolter.",
  "weapons": [
    {
      "name": "Cerberus launcher",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav, Deep Strike, Open",
    "Transport: This model has a transport capacity of 5 Scouts."
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
  "min_cost": 135
};
