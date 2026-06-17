/**
 * DYNASTY PHAERON — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const dynastyPhaeron: Unit = {
  "name": "Dynasty Phaeron",
  "models": [
    {
      "name": "Dynasty Phaeron",
      "points": 1152,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "8",
        "I": "3",
        "A": "4",
        "LD": "10",
        "SV": "2+"
      }
    },
    {
      "name": "Triarchal Mehir",
      "points": 0,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "2+",
        "S": "5",
        "T": "8",
        "W": "6",
        "I": "2",
        "A": "1",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dynasty Phaeron is equipped with: Sceptre of Eternal Glory; Staff of Stars; Scythe of Dust. A Triarchal Mehir is equipped with: Annihilator beam.",
  "weapons": [
    {
      "name": "Annihilator beam",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(4), Beam"
    },
    {
      "name": "Sceptre of Eternal Glory - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+4",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Decimate"
    },
    {
      "name": "Sceptre of Eternal Glory - Shooting",
      "range": "24\"",
      "type": "Assault 2",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "Armorbane, AT(3), Decimate"
    },
    {
      "name": "Staff of Stars - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Staff of Stars - Shooting",
      "range": "24\"",
      "type": "Assault 9",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Deflagrate(5+)"
    },
    {
      "name": "Scythe of Dust",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Flurry(4)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav, Fearless, Regeneration(1), Terrifying(-2)",
    "My Will Be Done: Add +3 to each of your rolls during the Initiative phase.",
    "Obeisance Generators: Enemy models in direct base contact suffer a -4 penalty to their Initiative.",
    "Powers of the C'tan: The Dynasty Phaeron can manifest 2 powers per turn. He knows all the powers from the list of C'tan powers. Each power can only be used once per battle round.",
    "Royal Necrodermis: Reduces AP of enemy attacks against the Dynasty Phaeron by -1 (to a minimum of 0).",
    "Transtemporal Force Field: Models in this unit gain a 4+ invulnerability save."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
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
  "min_cost": 1152
};
