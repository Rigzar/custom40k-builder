/**
 * ARKANYST EVALUATOR — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const arkanystEvaluator: Unit = {
  "name": "Arkanyst Evaluator",
  "models": [
    {
      "name": "Arkanyst Evaluator",
      "points": 90,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Arkanys Evaluator is equipped with: Gravitic concussion grenades; Transmatter inverter.",
  "weapons": [
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    },
    {
      "name": "Transmatter inverter - Standard",
      "range": "24\"",
      "type": "Rapid Fire 3",
      "s": "7",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Transmatter inverter - Overheating",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Eye of the Ancestors, Steady Advance, Void armor",
    "Advisor: For every HQ selection, one Arkanyst Evaluator may be selected without taking up an Elite slot.",
    "Ressource Transmutation: The model and its attached unit gain \"Deflagrate(5+)\" for all ranged weapons."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 90
};
