/**
 * PYROVORE BROOD — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const pyrovoreBrood: Unit = {
  "name": "Pyrovore Brood",
  "models": [
    {
      "name": "Pyrovore",
      "points": 75,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "2",
        "A": "2",
        "LD": "6",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Acid maw; Flamespurt.",
  "weapons": [
    {
      "name": "Acid maw",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamespurt - Burning spray",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Flamespurt - Pyrogout",
      "range": "18\"",
      "type": "Assault 8",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hardened Carapace",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
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
    "Instinctive Behaviour, Massive(2), Move Through Cover",
    "Volatile: The model always explodes like a vehicle."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 75,
  "is_monster": false
};
