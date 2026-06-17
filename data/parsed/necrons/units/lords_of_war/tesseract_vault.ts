/**
 * TESSERACT VAULT — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tesseractVault: Unit = {
  "name": "Tesseract Vault",
  "models": [
    {
      "name": "Tesseract Vault",
      "points": 1190,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "2+",
        "S": "10",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "2",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tesseract Vault is equipped with: 4 Tesla spheres.",
  "weapons": [
    {
      "name": "Tesla sphere - Normal",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla"
    },
    {
      "name": "Tesla sphere - Sentinel",
      "range": "24\"",
      "type": "Heavy 6",
      "s": "8",
      "ap": "0",
      "d": "2",
      "abilities": "Tesla"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav, Deep strike",
    "Living metal: The model repairs one vehicle damage at the start of its activation in any order.",
    "Lumbering: The model can never move more than 6\". If it arrives via Deep strike from reserve and would land on top of an enemy unit, move all models as little as possible to make room for the Tesseract Vault.",
    "Gravity pulse: All enemy Anti-Grav, Flyer and Jetbike units treat all terrain within 18\" of a Tesseract Vault, including open ground, as dangerous terrain. If any of these units do anything within 18\" range, they have to make a difficult terrain test.",
    "Hovering sentinel: If the model uses a \"Stand & Shoot\" order, it may use the \"Sentinel\" profile for its Tesla Spheres.",
    "Powers of the Transcended C'tan: The model can manifest 3 powers per turn. It knows all the powers from the list of C'tan powers. Each C'tan power can be used up to three times per battle round.",
    "Transtemporal Force Field: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Super-heavy Vehicle",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 1190
};
