/**
 * MEMNYR STRATEGIST — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const memnyrStrategist: Unit = {
  "name": "Memnyr Strategist",
  "models": [
    {
      "name": "Memnyr Strategist",
      "points": 41,
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
  "equipped_with": "A Memnyr Strategist is equipped with: Gravitic concussion grenades.",
  "weapons": [
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Eye of the Ancestors, Steady Advance, Void armor",
    "Advisor: For every HQ selection, one Memnyr Strategist may be selected without taking up an Elite slot.",
    "Computational Mastermind: While the model is on the battlefield, you may change a friendly unit's order to any other order when that unit gets activated.",
    "Predictive Guidance: The model and its attached unit do not suffer the to hit penalty from Defensive Fire."
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
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 41
};
