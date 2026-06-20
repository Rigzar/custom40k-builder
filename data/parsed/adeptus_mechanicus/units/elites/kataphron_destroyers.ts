/**
 * KATAPHRON DESTROYERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kataphronDestroyers: Unit = {
  "name": "Kataphron Destroyers",
  "models": [
    {
      "name": "Destroyer",
      "points": 86,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Cognis flamer; Heavy grav-cannon.",
  "weapons": [
    {
      "name": "Cognis flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heavy grav-cannon",
      "range": "30\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Barrage, Grav"
    },
    {
      "name": "Phosphor blaster",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Luminagen"
    },
    {
      "name": "Plasma culverin - Standard",
      "range": "30\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma culverin - Overheating",
      "range": "30\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Flamer",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Phosphor blaster",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Cognis flamer"]
    },
    {
      "header": "Any model may swap their Heavy grav-cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Plasma culverin",
          "points": 42
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy grav-cannon"]
    }
  ],
  "abilities": [
    "Massive(1), Monotask, Unyielding",
    "Bionics: This model receives a 6+ invulnerability save."
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
  "default_size": 3,
  "min_cost": 258
};
