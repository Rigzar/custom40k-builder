/**
 * HIPPOGRIFF AFV — Fast Attack
 *
 * SOURCE: Imperial Guard 1.01.ods (July 2026 update — new unit).
 *   Hippogriff AFV | M 12" | BS 4+ | S 5 | FRONT 11 | SIDE 10 | REAR 10 | I 3 | A 1 | HP 2 | 125 pts
 *   Squadron 1-2 (ODS date artifact 2022-02-01 → min 1 / max 2) — Squadron ability.
 *   Equipped with: Chiron gatling cannon; Heavy stubber.
 *   Options: swap Chiron gatling cannon (Vigilator cannon +15 / Lascannon +24 / Melta cannon +48);
 *            swap Heavy stubber (Melta +2); access to vehicle equipment from the Armory.
 */

import type { Unit } from '../../../../../src/types/data';

export const hippogriff_afv: Unit = {
  "name": "Hippogriff AFV",
  "models": [
    {
      "name": "Hippogriff AFV",
      "points": 125,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hippogriff AFV is equipped with: Chiron gatling cannon; Heavy stubber.",
  "weapons": [
    {
      "name": "Chiron gatling cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Melta cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Explosive, Melta"
    },
    {
      "name": "Vigilator cannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Every Hippogriff AFV may swap its Chiron gatling cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Vigilator cannon",
          "points": 15
        },
        {
          "name": "Lascannon",
          "points": 24
        },
        {
          "name": "Melta cannon",
          "points": 48
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Chiron gatling cannon"]
    },
    {
      "header": "Every Hippogriff AFV may swap its Heavy stubber",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Melta",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy stubber"]
    }
  ],
  "abilities": [
    "Squadron"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 125
};
