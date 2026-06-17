/**
 * WARBIKERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const warbikers: Unit = {
  "name": "Warbikers",
  "models": [
    {
      "name": "Warbiker",
      "points": 47,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Nob",
      "points": 67,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Choppa; Dakkagun; Slugga.",
  "weapons": [
    {
      "name": "Choppa",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Dakkagun",
      "range": "18\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
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
      "header": "One Warbiker may be upgraded to a Nob for +20 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 20,
      "variant_link": "Nob",
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
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
    "Dakka Dakka Dakka, Mob, Furious charge, Waaagh!"
  ],
  "unit_type": "Bike",
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
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 141
};
