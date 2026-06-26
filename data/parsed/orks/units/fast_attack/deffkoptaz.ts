/**
 * DEFFKOPTAZ — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deffkoptaz: Unit = {
  "name": "Deffkoptaz",
  "models": [
    {
      "name": "Killakopta",
      "points": 45,
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
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Kustom mega-blasta; Spinnin'blades; Stikkbombz.",
  "weapons": [
    {
      "name": "Big bomb",
      "range": "6\"",
      "type": "Assault 1",
      "s": "10",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), AT(3), Barrage"
    },
    {
      "name": "Kopta rokkits",
      "range": "24\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
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
      "name": "Spinnin'blades",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Twin big shoota",
      "range": "36\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
          "points": 4
        },
        {
          "name": "'Eavy armour",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "Every model may swap their Kustom mega-blasta",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin big shoota",
          "points": 8
        },
        {
          "name": "Kopta rokkits",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Kustom mega-blasta"]
    },
    {
      "header": "For every 3 models, one Killakopta may be equipped with a Big bomb for +13 points.",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Big bomb",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
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
    "Dakka Dakka Dakka, Deep strike, Furious charge, Mob, Waaagh!"
  ],
  "unit_type": "Jetbike",
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
  "min_cost": 135
};
