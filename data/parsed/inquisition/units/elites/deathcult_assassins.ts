/**
 * DEATHCULT ASSASSINS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deathcultAssassins: Unit = {
  "name": "Deathcult Assassins",
  "models": [
    {
      "name": "Deathcult Assassin",
      "points": 28,
      "min": 2,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Power sword.",
  "weapons": [
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deflect, Infiltrator, Parry",
    "Lightning reflexes: The model gains a 5+ invulnerability save."
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
  "default_size": 2,
  "min_cost": 56
};
