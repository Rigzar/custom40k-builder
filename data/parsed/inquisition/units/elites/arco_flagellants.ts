import type { Unit } from '../../../../../src/types/data';

export const arcoFlagellants: Unit = {
  "name": "Arco-flagellants",
  "models": [
    {
      "name": "Arco-flagellant",
      "points": 21,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "4",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Arco flail.",
  "weapons": [
    {
      "name": "Arco flail",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Berserk(5+), Blind rage"
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
  "min_cost": 21
};
