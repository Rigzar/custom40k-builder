/**
 * BLOOD SLAUGHTERER — Heavy Support
 *
 * SOURCE: Chaos Space Marines 1.02.ods / "Blood Slaughterer" (added CSM 1.02, 2026-07-24).
 * Walker, 1-2 models (Squadron), 195 pts. Baked-in Mark of Khorne. Vehicle equipment only.
 */

import type { Unit } from '../../../../../src/types/data';

export const bloodSlaughterer: Unit = {
  "name": "Blood Slaughterer",
  "models": [
    {
      "name": "Blood Slaughterer",
      "points": 195,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Blood Slaughterer is a single model and equipped with: 2 Dreadnought close combat weapons.",
  "weapons": [
    {
      "name": "Dreadnought close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Impaler",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "3",
      "abilities": "Armor piercing(5+), AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May replace one Dreadnought close combat weapon:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Impaler",
          "points": 43
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Dreadnought close combat weapon"
      ]
    }
  ],
  "abilities": [
    "Deep Strike, Mark of Khorne, Move through cover, Squadron",
    "Furioso: If the model is equipped with two melee weapons, it gains +2 attacks.",
    "Impaled: Vehicles and Monstrous creatures hit by the Impaler that are not destroyed are dragged into base contact towards the Blood Slaughterer. It then counts as having charged the target.",
    "Rampage: The unit gains +2 attacks if the combat it is in contains more enemy models than friendly models."
  ],
  "unit_type": "Walker",
  "keywords": [
    "Chaos Space Marine",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 195
};
