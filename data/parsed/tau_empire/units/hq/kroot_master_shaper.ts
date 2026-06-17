/**
 * KROOT MASTER SHAPER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const krootMasterShaper: Unit = {
  "name": "Kroot Master Shaper",
  "models": [
    {
      "name": "Master Shaper",
      "points": 23,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "3",
        "I": "5",
        "A": "4",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Shaper Chief",
      "points": 38,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "3",
        "I": "5",
        "A": "5",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "A Master Shaper is equipped with: -.",
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
      "name": "Pulse carbine",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Pulse rifle",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-1",
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
      "header": "May be equipped with up to two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Kroot pistol",
          "points": 0
        },
        {
          "name": "Shaper's blade",
          "points": 5
        },
        {
          "name": "Twin ritualistic blades",
          "points": 5
        },
        {
          "name": "Dart-bow",
          "points": 6
        },
        {
          "name": "Kroot rifle",
          "points": 6
        },
        {
          "name": "Pulse rifle",
          "points": 6
        },
        {
          "name": "Kroot carbine",
          "points": 8
        },
        {
          "name": "Kroot scattergun",
          "points": 8
        },
        {
          "name": "Pulse carbine",
          "points": 8
        },
        {
          "name": "Bladestave",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Master Shaper per army can be upgraded to a Shaper Chief for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Shaper Chief",
      "is_unique_per_army": true
    },
    {
      "header": "One Kroot Master Shaper per army may be upgraded to a Shaman for +10 points. The Shaman is a Psyker who can cast 1 power and deny 1 power per battle round, and knows 2 powers from the Biomancy or Divination disciplines.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": null,
      "is_unique_per_army": true,
      "available_if": { "type": "instanceOf", "scope": "archetype", "keyword": "Kroot Hunting Pack" }
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
    "Evolutionary Adaptation: A Master Shaper may assign a free Signature Evolutionary Adaptation trait to itself and one other friendly Kroot unit at the start of deployment. It may not assign a Signature Evolutionary Adaptation the army has already chosen.",
    "Shaper Chief: A Shaper Chief may assign its Evolutionary Adaptation to an additional friendly Kroot unit.",
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 23
};
