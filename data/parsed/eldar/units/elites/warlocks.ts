/**
 * WARLOCKS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and two powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const warlocks: Unit = {
  "name": "Warlocks",
  "models": [
    {
      "name": "Warlock",
      "points": 32,
      "min": 1,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Warlock is equipped with: Plasma grenade.",
  "weapons": [
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "For every 500 points of game size, a single Warlock may be included in the army that does not take up an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 0,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus, Command squad",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and two powers from a chosen discipline.",
    "Seer council: A Farseer gets a cumulative +1 bonus to casting and denying psychic powers for each Warlock in their unit. Accompanying Warlocks receive the same bonus for each Warlock after the first."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 32
};
