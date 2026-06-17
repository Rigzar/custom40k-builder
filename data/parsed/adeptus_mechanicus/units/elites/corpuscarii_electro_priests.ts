/**
 * CORPUSCARII ELECTRO-PRIESTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const corpuscariiElectroPriests: Unit = {
  "name": "Corpuscarii Electro-Priests",
  "models": [
    {
      "name": "Electro-Priest",
      "points": 25,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Electrostatic gauntlets.",
  "weapons": [
    {
      "name": "Electrostatic gauntlets - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "1",
      "abilities": "Tesla"
    },
    {
      "name": "Electrostatic gauntlets - Ranged",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Tesla"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Blind Rage, Canticles of the Omnissiah, Choir Master, Furious Charge",
    "Voltagheist Field: The model gains a 4+ invulnerability save."
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
  "min_cost": 125
};
