/**
 * RHINO — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and Fortitude."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const rhino: Unit = {
  "name": "Rhino",
  "models": [
    {
      "name": "Rhino",
      "points": 121,
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
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Rhino is equipped with: Storm bolter.",
  "weapons": [
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with a Storm bolter for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Aegis(5+), Shrouding, Fire hatches(2)",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and Fortitude.",
    "Transport: This model has a transport capacity of 10 infantry models. It can't transport models in Terminator armor."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 121
};
