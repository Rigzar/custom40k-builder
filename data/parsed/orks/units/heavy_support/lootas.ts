/**
 * LOOTAS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lootas: Unit = {
  "name": "Lootas",
  "models": [
    {
      "name": "Loota",
      "points": 24,
      "min": 5,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Spanna",
      "points": 10,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every Loota is equipped with: Deffgun.\nEvery Spanna is equipped with: Choppa; Slugga.",
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
      "name": "Kustom mega-blasta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive, Overheating"
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
      "name": "Slugga",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Deffgun - Shooty",
      "range": "48\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Looted"
    },
    {
      "name": "Deffgun - Beamy",
      "range": "48\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Looted"
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
          "points": 5
        },
        {
          "name": "'Eavy armour",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to three Lootas may be upgraded to Spannas for -14 points each.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": -14,
      "variant_link": "Spanna",
      "is_unique_per_army": false
    },
    {
      "header": "Every Spanna may swap their Choppa and Slugga",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 6
        },
        {
          "name": "Rokkit launcha",
          "points": 11
        },
        {
          "name": "Kustom mega-blasta",
          "points": 12
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Choppa", "Slugga"]
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
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!",
    "Looted: When a unit shoots with this weapon, before selecting a target roll a D6. On a result of 1-3, all deffguns in the unit must use the \"Shooty\" profile. On a result of 4-6, they must all use the \"Beamy\" profile."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
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
  "slot": "Heavy Support",
  "default_size": 5,
  "min_cost": 120
};
