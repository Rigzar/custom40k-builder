/**
 * KROOTOX RAMPAGERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootoxRampagers: Unit = {
  "name": "Krootox Rampagers",
  "models": [
    {
      "name": "Krootox Rampager",
      "points": 48,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "6",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Krootox Rampagers are equipped with: Hunting javelin; Kroot pistol; Krootox fist.",
  "weapons": [
    {
      "name": "Hunting javelin",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "2",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Kroot pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Krootox fist",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every unit of Kroot Carnivores, one unit of Krootox Rampagers may be taken without using an ELITE slot.",
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
    "Furious Charge, Infiltrator, Supporting Fire, Use Cover"
  ],
  "unit_type": "Monstrous Infantry, Kroot",
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
  "advisor": true,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 144
};
