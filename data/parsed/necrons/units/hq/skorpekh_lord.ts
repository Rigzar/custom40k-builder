/**
 * SKORPEKH LORD — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skorpekhLord: Unit = {
  "name": "Skorpekh Lord",
  "models": [
    {
      "name": "Skorpekh Lord",
      "points": 287,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "6",
        "W": "6",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Skorpekh Lord is equipped with: Enmitic annihilator; Hyperphase harvester.",
  "weapons": [
    {
      "name": "Enmitic annihilator",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "6",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Hyperphase harvester",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(2), Unwieldy"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Favoured enemy(everything), Furious Charge, Move through cover, Regeneration(1)",
    "Royal Necrodermis: Reduces AP of enemy attacks by -1 (to a minimum of 0)."
  ],
  "unit_type": "Character Model, Monstrous Creature, Lord, Necron",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": true,
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
  "min_cost": 287
};
