import type { Unit } from '../../../../../src/types/data';

export const missionaries: Unit = {
  "name": "Missionaries",
  "models": [
    {
      "name": "Missionary",
      "points": 17,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Chainsword; Las pistol.",
  "weapons": [
    {
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Las pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Eviscerator",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2), Armorbane"
    }
  ],
  "option_groups": [
    {
      "header": "Each Missionary may be equipped with:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Eviscerator",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command Squad",
    "Devout: A Missionary can recite 1 hymn per turn. A hymn is successfully recited on a roll of 3+. A missionary knows a prayer from the Hymns of Battle."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "is_priest": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 17
};
