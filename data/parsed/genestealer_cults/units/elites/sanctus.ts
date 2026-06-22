/**
 * SANCTUS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sanctus: Unit = {
  "name": "Sanctus",
  "models": [
    {
      "name": "Sanctus",
      "points": 57,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Sanctus is equipped with: Bio-dagger; Cult sniper rifle; Familiar's claws.",
  "weapons": [
    {
      "name": "Bio-dagger",
      "range": "-",
      "type": "Melee",
      "s": "1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1), Poison(2+), Precision(5+)"
    },
    {
      "name": "Cult sniper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Familiar's claws",
      "range": "-",
      "type": "Melee",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 500 points of game size, one Sanctus may be included in the army that does not take up an Elite slot.",
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
    "Ambush, Deflect, Infiltrator, Use cover",
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 57
};
