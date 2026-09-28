/**
 * TERMAGANT BROOD â€” Troops
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const termagantBrood: Unit = {
  "name": "Termagant Brood",
  "models": [
    {
      "name": "Termagants",
      "points": 5,
      "min": 10,
      "max": 20,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "4",
        "A": "1",
        "LD": "5",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Spinefists.",
  "weapons": [
    {
      "name": "Fleshborer",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lesser devourer",
      "range": "18\"",
      "type": "Rapid Fire 1",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Shardlauncher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
    },
    {
      "name": "Spike rifle",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Spinefists",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Strangleweb",
      "range": "9\"",
      "type": "Assault 4",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1), Monofilament"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Spinefists",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Lesser devourer",
          "points": 1
        },
        {
          "name": "Fleshborer",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Spinefists"
      ]
    },
    {
      "header": "For every 10 models, one Termagant may swap their Fleshborer",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Strangleweb",
          "points": 0
        },
        {
          "name": "Shardlauncher",
          "points": 6
        },
        {
          "name": "Spike rifle",
          "points": 10
        }
      ],
      "replaces": [
        "Fleshborer"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "requires_choice": [
        "Fleshborer"
      ]
    },
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Scuttlers",
          "points": 1,
          "effect": {
            "grants_abilities": [
              "Scuttlers: The unit gains the \"Vanguard\" ability."
            ]
          }
        },
        {
          "name": "Endless",
          "points": 4,
          "effect": {
            "grants_abilities": [
              "Endless: If the unit is below half its starting strength or is destroyed, it can be removed from the field once per game at the end of the battle round and automatically reappears as a reserve at full starting strength in the next battle round. You get one \"Spawning pool\" token for every started three units with this ability."
            ]
          }
        },
        {
          "name": "Hardened Carapace",
          "points": 3,
          "effect": {
            "grants_abilities": [
              "Hardened Carapace: The unit improves its armor save by +1."
            ],
            "stat_mod": [
              {
                "stat": "SV",
                "delta": -1
              }
            ]
          }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    }
  ],
  "abilities": [
    "Instinctive Behaviour, Move Through Cover"
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid",
    "Basic Bioform"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 10,
  "min_cost": 50,
  "is_monster": false
};
