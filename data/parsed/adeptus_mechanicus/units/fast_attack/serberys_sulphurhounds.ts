/**
 * SERBERYS SULPHURHOUNDS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const serberysSulphurhounds: Unit = {
  "name": "Serberys Sulphurhounds",
  "models": [
    {
      "name": "Sulphurhound",
      "points": 35,
      "min": 2,
      "max": 5,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Sulphurhound Alpha",
      "points": 40,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 2 Phosphor pistols, Sulphur breath.",
  "weapons": [
    {
      "name": "Phosphor blast carbine",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Luminagen"
    },
    {
      "name": "Phosphor pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Luminagen"
    },
    {
      "name": "Sulphur breath",
      "range": "9\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "One Sulphurhound may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Enhanced data-tether",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 3 models, one Sulphurhound may swap both Phosphor pistols",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Phosphor blast carbine",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Phosphor pistol"]
    },
    {
      "header": "The unit may select one Doctrina Imperative.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Canticles of the Omnissiah, Move through cover",
    "Bionics: This model receives a 6+ invulnerability save.",
    "Rad-saturation: Enemy models in direct base contact suffer a -1 penalty to their Toughness."
  ],
  "unit_type": "Bike",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 110
};
