/**
 * SLAUGHTERBRUTE — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const slaughterbrute: Unit = {
  "name": "Slaughterbrute",
  "models": [
    {
      "name": "Slaughterbrute",
      "points": 103,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "T": "6",
        "W": "4",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Slaughterbrute is equipped with: Mighty jaw; Slaughter claws.",
  "weapons": [
    {
      "name": "Mighty jaw",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Slaughter claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(3)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Daemon, Frenzy(2\"), Mark of Khorne, Daemonic instability, Squadron, Terrifying(-1)",
    "Bound Beast: For every HQ unit with a Mark of Khorne, you may select one Slaughterbrute without using up a Fast Attack slot.",
    "Eager for carnage: The model automatically advances 6\" with an \"Advance\" command."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 103
};
