/**
 * PRIMUS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const primus: Unit = {
  "name": "Primus",
  "models": [
    {
      "name": "Primus",
      "points": 38,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
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
  "equipped_with": "A Primus is equipped with: -.",
  "weapons": [],
  "option_groups": [
    {
      "header": "Only one Primus per army.",
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
    "Cult Demagogue: The Primus and its attached unit gain the \"Favoured enemy(everything)\" ability.",
    "Ringleader: You may select up to two units with this ability for a single HQ slot. Each unit may only be taken once.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability."
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 38
};
