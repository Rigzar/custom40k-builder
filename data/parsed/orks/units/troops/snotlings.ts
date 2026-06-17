/**
 * SNOTLINGS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const snotlings: Unit = {
  "name": "Snotlings",
  "models": [
    {
      "name": "Snotling Herd",
      "points": 6,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "1",
        "T": "1",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "3",
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
  "equipped_with": "Every Snotling Herd is equipped with: Hopes and dreams (Nothing).",
  "weapons": [
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
      "header": "The unit may contain one Runtherd for every 3 Snotling Herd models.",
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
    "Cowardly: You can't select more Snotling units than Boyz units.",
    "Good for nothing: Snotlings can't contest or hold mission objectives. Likewise they do not count for any VP when destroyed.",
    "Squig hound: The unit may automatically pass a Leadership test in the Rally phase if it suffers 1D3 Mortal Wounds. The Squig hound is consumed in the process.",
    "Unorky: Character models can't join Snotlings."
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
  "default_size": 4,
  "min_cost": 22
};
