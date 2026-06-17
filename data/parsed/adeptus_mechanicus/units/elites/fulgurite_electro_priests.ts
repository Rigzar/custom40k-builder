/**
 * FULGURITE ELECTRO-PRIESTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fulguriteElectroPriests: Unit = {
  "name": "Fulgurite Electro-Priests",
  "models": [
    {
      "name": "Electro-Priest",
      "points": 25,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
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
  "equipped_with": "Every model is equipped with: Electroleech stave.",
  "weapons": [
    {
      "name": "Electroleech stave",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "Deadly(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Blind Rage, Canticles of the Omnissiah, Choir Master, Furious Charge",
    "Siphoned Vigour: Everytime this unit caused an unsaved Wound, one previously slain model is restored to the unit.",
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
