/**
 * BIOPHAGUS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const biophagus: Unit = {
  "name": "Biophagus",
  "models": [
    {
      "name": "Biophagus",
      "points": 37,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Biophagus is equipped with: Chemical vials; Injector goad.",
  "weapons": [
    {
      "name": "Chemical vials",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "1",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Poison(2+)"
    },
    {
      "name": "Injector goad",
      "range": "-",
      "type": "Melee",
      "s": "1",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(2+), Quick(+1)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 500 points of game size, one Biophagus may be included in the army that does not take up an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 500,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ambush, Command Squad, Infiltrator, Use cover",
    "Alchemicus familiar: Can be used once per battle to grant \"Poison(2+)\" for all melee weapons of an attached unit until the end of the current battle round.",
    "Genomic enhancement: Once per activation, the model can boost a friendly creature unit within 3\" range.\n1 - The unit gains +1 Strength. \n2 - The unit gains +1 Toughness. \n3 - The unit gets +1 BS and +1 WS. \nCharacter models cannot be upgraded. Each unit can only be upgraded once per game.",
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
  "min_cost": 37
};
