/**
 * BIOVORE BROOD â€” Heavy Support
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const biovoreBrood: Unit = {
  "name": "Biovore Brood",
  "models": [
    {
      "name": "Biovore",
      "points": 110,
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
  "variant_models": [
    ],
  "equipped_with": "Every model is equipped with: Spore Mine launcher.",
  "weapons": [
    {
      "name": "Spore Mine launcher",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Blast(4), Indirect, Suppression(3)"
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
          "points": 10,
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
        },
        {
          "name": "Resonator",
          "points": 7,
          "effect": {
            "grants_abilities": [
              "Resonator: The unit gains a 6+ ward save while within 6\" of a unit with the \"Synapse\" ability. Can be within range of itself, if it has the \"Synapse\" ability."
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
    "Instinctive Behaviour, Massive(2), Move Through Cover",
    "Spore Mine Launcher: Instead of shooting at an enemy, a Biovore may create a unit of \"Spore Mine Cluster\" (3 models) within 48\" of itself and at least 9\" away from any enemy unit."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [
    "Tyranid",
    "Advanced Bioform"
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 111,
  "is_monster": false
};
