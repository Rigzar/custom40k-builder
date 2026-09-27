/**
 * HIVE GUARD BROOD â€” Elites
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hiveGuardBrood: Unit = {
  "name": "Hive Guard Brood",
  "models": [
    {
      "name": "Hive Guard",
      "points": 41,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "2",
        "I": "2",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Shock cannon.",
  "weapons": [
    {
      "name": "Impaler cannon",
      "range": "24\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Seeking, Indirect"
    },
    {
      "name": "Shock cannon",
      "range": "18\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1), Blast(4), Haywire"
    }
  ],
  "option_groups": [
    {
      "header": "Any model can swap its Shock cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Impaler cannon",
          "points": 43
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Shock cannon"
      ]
    },
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hardened Carapace",
          "points": 7,
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
          "points": 4,
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
    "Instinctive Behaviour, Massive(1), Move Through Cover"
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 41,
  "is_monster": false
};
