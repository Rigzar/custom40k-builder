/**
 * SKARBOYZ — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skarboyz: Unit = {
  "name": "Skarboyz",
  "models": [
    {
      "name": "Skarboy",
      "points": 14,
      "min": 5,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Nob",
      "points": 31,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Choppa; Slugga; Stikkbombz.",
  "weapons": [
    {
      "name": "Big shoota",
      "range": "36\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Shoota",
      "range": "18\"",
      "type": "Assault 3",
      "s": "4",
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
    },
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Wildork",
          "points": 3
        },
        {
          "name": "'Eavy armour",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "Any number of models may swap their Choppa and Slugga",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shoota",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Choppa", "Slugga"]
    },
    {
      "header": "For every 5 models, one Skarboy may swap their Choppa and Slugga",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 8
        },
        {
          "name": "Burna",
          "points": 9
        },
        {
          "name": "Rokkit launcha",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Skarboy may be upgraded to a Nob for +17 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 17,
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
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!"
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
  "default_size": 5,
  "min_cost": 70
};
