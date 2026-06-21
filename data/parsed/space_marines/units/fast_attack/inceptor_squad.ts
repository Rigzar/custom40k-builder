/**
 * INCEPTOR SQUAD — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const inceptorSquad: Unit = {
  "name": "Inceptor Squad",
  "models": [
    {
      "name": "Inceptor Marine",
      "points": 66,
      "min": 2,
      "max": 5,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Inceptor Sergeant",
      "points": 66,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Inceptor Sergeant",
      "points": 76,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: 2 Assault bolters; Gravis armor.",
  "armourKeyword": "Gravis",
  "weapons": [
    {
      "name": "Assault bolter",
      "range": "18\"",
      "type": "Pistol 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma exterminator (Standard)",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma exterminator (Overheating)",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "7",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "All models may swap their two Assault bolters",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "two Plasma exterminators",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Assault bolter"]
    },
    {
      "header": "The Inceptor Sergeant may be upgraded to a Veteran Inceptor Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Inceptor Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, Massive(1), They Shall Know No Fear, Unyielding",
    "Gravis armor: The model gains a 6+ invulnerability save."
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 198
};
