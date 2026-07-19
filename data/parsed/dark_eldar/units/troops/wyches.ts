/**
 * WYCHES — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wyches: Unit = {
  "name": "Wyches",
  "models": [
    {
      "name": "Wych",
      "points": 11,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Hekatrix",
      "points": 16,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Hekatarii blade; Splinter pistol; Plasma grenade.",
  "weapons": [
    {
      "name": "Shardnet and impaler",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Enemy models in base contact reduce their Attacks by 1 (minimum 1)"
    },
    {
      "name": "Hekatarii blade",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Hydra gauntlets",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(3)"
    },
    {
      "name": "Razorflails",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Re-roll to hit and to wound rolls, Flurry(1)"
    },
    {
      "name": "Plasma grenade",
      "range": "-",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Splinter pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, up to two Wyches my replace their Hekatarii blade",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Hydra gauntlets",
          "points": 1
        },
        {
          "name": "Razorflails",
          "points": 1
        },
        {
          "name": "Shardnet and impaler",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Hekatrix for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Hekatrix",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat drugs, Deflect, Power through Pain, Parry"
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Cult"
  ],
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 55
};
