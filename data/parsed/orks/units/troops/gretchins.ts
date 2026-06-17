/**
 * GRETCHINS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const gretchins: Unit = {
  "name": "Gretchins",
  "models": [
    {
      "name": "Gretchin",
      "points": 3,
      "min": 10,
      "max": 30,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "2",
        "T": "2",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "4",
        "SV": "6+"
      }
    },
    {
      "name": "Runtherd",
      "points": 4,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Gretchin is equipped with: Grot blasta.",
  "weapons": [
    {
      "name": "Grot blasta",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Grabba stikk",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Slugga",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "The unit may contain one Runtherd for every 10 Gretchin models.",
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
    "Cowardly: You can't select more Gretchin units than Boyz units.",
    "Squig hound: The unit may automatically pass a Leadership test in the Rally phase if it suffers 1D3 Mortal Wounds. The Squig hound is consumed in the process.",
    "Unorky: Character models can't join Gretchins."
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
  "slot": "Troops",
  "default_size": 11,
  "min_cost": 34
};
