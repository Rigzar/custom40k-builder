/**
 * VENERABLE CONTEMPTOR DREADNOUGHT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const venerableContemptorDreadnought: Unit = {
  "name": "Venerable Contemptor Dreadnought",
  "models": [
    {
      "name": "Contemptor Dreadnought",
      "points": 270,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Contemptor Dreadnought is a single model and equipped with: Combi-bolter; Dreadnought close combat weapon; Multi-melta.",
  "weapons": [
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Combi-bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kheres-pattern assault cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Dreadnought close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Can swap its Multi-melta",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Kheres-pattern assault cannon",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Shield Host, Squadron",
    "Custodes Atomantic Shielding: The model has a 5+ invulnerability save. Enemy attacks receive a -1 AT penalty (to a minimum of 1)."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 270
};
