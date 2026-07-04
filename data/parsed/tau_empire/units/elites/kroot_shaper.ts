/**
 * KROOT SHAPER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootShaper: Unit = {
  "name": "Kroot Shaper",
  "models": [
    {
      "name": "Shaper",
      "points": 11,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Shaper is equipped with: -.",
  "weapons": [
    {
      "name": "Bladestave",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "Unwieldy"
    },
    {
      "name": "Dart-bow",
      "range": "24\"",
      "type": "Assault 2",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Armor piercing(5+), Deadly(5+)"
    },
    {
      "name": "Kroot pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Shaper's blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Twin ritualistic blades",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(2), Shred, Unwieldy"
    },
    {
      "name": "Kroot rifle - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot rifle - Ranged",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot carbine - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot carbine - Ranged",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot scattergun - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kroot scattergun - Ranged",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "For every Master Shaper or unit of Kroot Carnivores, one Kroot Shaper may be taken without using an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Kroot pistol",
          "points": 1
        },
        {
          "name": "Shaper's blade",
          "points": 4
        },
        {
          "name": "Twin ritualistic blades",
          "points": 4
        },
        {
          "name": "Dart-bow",
          "points": 5
        },
        {
          "name": "Kroot rifle",
          "points": 5
        },
        {
          "name": "Kroot carbine",
          "points": 6
        },
        {
          "name": "Kroot scattergun",
          "points": 6
        },
        {
          "name": "Bladestave",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be upgraded to one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Flesh Shaper",
          "points": 5
        },
        {
          "name": "Trail Shaper",
          "points": 5
        },
        {
          "name": "War Shaper",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Supporting Fire, Use Cover",
    "Upgrades",
    "Flesh Shaper: The model and its attached unit gain \"Deflagrate(6+)\" for all melee attacks.",
    "Trail Shaper: After all units have been placed in the Deployment phase, you may remove and redeploy this model and its attached unit.",
    "War Shaper: The model and its attached unit automatically remove all Battleshock tokens during each Reinforcement phase."
  ],
  "unit_type": "Character, Infantry, Kroot",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 11
};
