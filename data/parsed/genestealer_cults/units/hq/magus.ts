/**
 * MAGUS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const magus: Unit = {
  "name": "Magus",
  "models": [
    {
      "name": "Magus",
      "points": 62,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Magus is equipped with: -.",
  "weapons": [],
  "option_groups": [
    {
      "header": "Only one Magus per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Ambush, Infiltrator, Use cover",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline.",
    "Ringleader: You may select up to two units with this ability for a single HQ slot. Each unit may only be taken once.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability."
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 62
};
