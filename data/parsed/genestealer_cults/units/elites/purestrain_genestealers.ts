/**
 * PURESTRAIN GENESTEALERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const purestrainGenestealers: Unit = {
  "name": "Purestrain Genestealers",
  "models": [
    {
      "name": "Purestrain Genestealer",
      "points": 18,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "6+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "6",
        "A": "4",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Piercing claws.",
  "weapons": [
    {
      "name": "Piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "every"
      },
      "choices": [
        { "name": "Miasmic strain", "points": 1 },
        { "name": "Reaperfex strain", "points": 2 },
        { "name": "Bulwark strain", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All models may be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Scything talons",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Deflect, Infiltrator, Move through cover, Parry, Use cover"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 90
};
