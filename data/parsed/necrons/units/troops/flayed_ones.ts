/**
 * FLAYED ONES — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const flayedOnes: Unit = {
  "name": "Flayed Ones",
  "models": [
    {
      "name": "Flayed Ones",
      "points": 22,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "1",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Flayer claws.",
  "weapons": [
    {
      "name": "Flayer claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(2), Shred"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep strike, Infiltrator, Reanimation Protocols, Terrifying(-1)"
  ],
  "unit_type": "Infantry, Necron",
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 110
};
