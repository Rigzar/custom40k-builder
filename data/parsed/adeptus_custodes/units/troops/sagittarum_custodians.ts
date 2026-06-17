/**
 * SAGITTARUM CUSTODIANS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sagittarumCustodians: Unit = {
  "name": "Sagittarum Custodians",
  "models": [
    {
      "name": "Sagittarum Custodian",
      "points": 86,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "All models are equipped with: Adrastus bolt caliver.",
  "weapons": [
    {
      "name": "Adrastus bolt caliver",
      "range": "24\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Deflagrate(5+), Suppression"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Massive(1), Shield Host",
    "Custodian armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 3,
  "min_cost": 258
};
