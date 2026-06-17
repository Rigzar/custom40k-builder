import type { Unit } from '../../../../../src/types/data';

export const jokaeroWeaponsmiths: Unit = {
  "name": "Jokaero Weaponsmiths",
  "models": [
    {
      "name": "Jokaero Weaponsmith",
      "points": 64,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "6+",
        "BS": "4+",
        "S": "2",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Jokaero digital weapons (choose one profile per activation).",
  "weapons": [
    {
      "name": "Jokaero Digital Weapons - Beams",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Jokaero Digital Weapons - Bolts",
      "range": "48\"",
      "type": "Assault 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Jokaero Digital Weapons - Flames",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Jokaero Digital Weapons - Strike",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "1",
      "abilities": "Hits automatically wound"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Infiltrator",
    "Defence orb: The model gains a 5+ invulnerability save."
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 64
};
