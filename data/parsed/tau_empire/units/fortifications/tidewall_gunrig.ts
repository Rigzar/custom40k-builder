/**
 * TIDEWALL GUNRIG — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tidewallGunrig: Unit = {
  "name": "Tidewall Gunrig",
  "models": [
    {
      "name": "Tidewall Gunrig",
      "points": 375,
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
  "equipped_with": "A Tidewall Gunrig is a single model and equipped with: Supremacy railgun.",
  "weapons": [
    {
      "name": "Supremacy railgun",
      "range": "120\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-6",
      "d": "4",
      "abilities": "Armorbane, AT(4), Beam, Decimate"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav, Open, Supporting Fire",
    "Transport: This model has a transport capacity of 10 models.",
    "Automated weapons: Unless at least one passenger is embarked on the unit, it can only shoot at the nearest target and receives a -1 to hit penalty.",
    "Mobile defenses: The model can only move if it has embarked passengers inside."
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
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 375
};
