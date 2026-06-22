/**
 * ABOMINANT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const abominant: Unit = {
  "name": "Abominant",
  "models": [
    {
      "name": "Abominant",
      "points": 55,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Abominant is equipped with: -.",
  "weapons": [],
  "option_groups": [
    {
      "header": "For every 500 points of game size, one Abominant may be included in the army that does not take up an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Berserk, Infiltrator, Massive(1), Regeneration(1), Use cover",
    "Mindwyrm familiar: The model can re-roll 1 to hit and 1 to wound roll.",
    "The Chosen One: All melee weapons of the Abominant and its attached unit gain the \"Deflagrate(5+)\" ability.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability."
  ],
  "unit_type": "Character Model, Monstrous Infantry",
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
  "min_cost": 55
};
