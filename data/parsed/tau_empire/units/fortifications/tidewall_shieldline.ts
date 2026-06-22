/**
 * TIDEWALL SHIELDLINE — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tidewallShieldline: Unit = {
  "name": "Tidewall Shieldline",
  "models": [
    {
      "name": "Tidewall Shieldline",
      "points": 189,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "4+",
        "S": "-",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "12",
        "I": "-",
        "A": "-",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tidewall Shieldline is a single model and equipped with: -.",
  "weapons": [],
  "option_groups": [],
  "abilities": [
    "Anti-Grav, Open",
    "Transport: This model has a transport capacity of 10 models.",
    "Mobile defenses: The model can only move if it has embarked passengers inside.",
    "Tidewall shield generator: The model and all embarked units have a 4+ invulnerability save."
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
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 189
};
