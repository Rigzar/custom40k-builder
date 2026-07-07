/**
 * DAEMON PRINCE — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const daemonPrince: Unit = {
  "name": "Daemon prince",
  "models": [
    {
      "name": "Daemon Prince",
      "points": 184,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "6",
        "W": "6",
        "I": "5",
        "A": "4",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Ascended Daemon Prince",
      "points": 289,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "7",
        "T": "7",
        "W": "7",
        "I": "7",
        "A": "5",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Daemon prince is a single model and equipped with: Malefic talons.",
  "weapons": [
    {
      "name": "Hellforged blade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Malefic talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May receive a Mark of Chaos",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 11
        },
        {
          "name": "Slaanesh",
          "points": 11
        },
        {
          "name": "Nurgle",
          "points": 28
        },
        {
          "name": "Tzeentch",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can get one of the following weapons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hellforged blade",
          "points": 18
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If no Mark of Khorne is taken, can be upgraded to a psyker for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false,
      "available_if": {
        "type": "notInstanceOf",
        "scope": "unit",
        "keyword": "Khorne"
      }
    },
    {
      "header": "Can be equipped with wings for +37 points to gain +6\" M and the \"Jump pack infantry\" Unit type.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 37,
      "variant_link": null,
      "is_unique_per_army": false,
      "effect": {
        "stat_mod": [
          {
            "stat": "M",
            "delta": 6
          }
        ],
        "adds_unit_types": [
          "Jump pack infantry"
        ]
      }
    },
    {
      "header": "One Daemon prince per army  can be upgraded to an Ascended Daemon prince for +90 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 90,
      "variant_link": "Ascended Daemon Prince",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Deep strike, Daemon, Daemonic instability, Terrifying(-1)",
    "Ascended Daemon prince: The unit uses a HQ slot instead of Heavy Support and always counts as the HQ unit with the highest points value in regards to the \"Animosity of the Gods\" rule. In addition, the model has all Marks of Chaos (already included in the profile), replaces the \"Daemon\" ability with \"Greater Daemon\", loses \"Daemonic instability\", gains \"Fearless\" and \"Terrifying(-2)\".",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and 1 power from a chosen discipline."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 184
};
