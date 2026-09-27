/**
 * VON RYAN'S LEAPER BROOD â€” Elites
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const vonRyansLeaperBrood: Unit = {
  "name": "Von Ryan's Leaper Brood",
  "models": [
    {
      "name": "Von Ryan's Leaper",
      "points": 36,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Rending claws.",
  "weapons": [
    {
      "name": "Rending claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Rending(5+)"
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
          "name": "Feeder Tendrils",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Feeder Tendrils: The unit gains the \"Favoured Enemy(everything)\" ability for itself and any friendly unit in the same melee combat."
            ]
          }
        },
        {
          "name": "Scuttlers",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Scuttlers: The unit gains the \"Vanguard\" ability."
            ]
          }
        },
        {
          "name": "Hardened Carapace",
          "points": 8,
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
          "points": 3,
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
    "Infiltrator, Massive(1), Move Through Cover, Stealth, Use cover",
    "Leaping charge: The unit has a 12\" Charge move."
  ],
  "unit_type": "Infantry",
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
  "default_size": 3,
  "min_cost": 108,
  "is_monster": false
};
