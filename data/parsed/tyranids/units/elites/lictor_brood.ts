/**
 * LICTOR BROOD â€” Elites
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lictorBrood: Unit = {
  "name": "Lictor Brood",
  "models": [
    {
      "name": "Lictor",
      "points": 116,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Flesh hooks, Scything talons, Piercing claws.",
  "weapons": [
    {
      "name": "Flesh hooks",
      "range": "6\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression(3)"
    },
    {
      "name": "Piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Extra Attack(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Each Lictor may be upgraded to one of the following specialisation",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Neurolictor",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
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
          "points": 27,
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
    "Deep Strike, Hit & Run, Infiltrate, Move Through Cover, Stealth, Squadron, Terrifying(-1), Use Cover",
    "Assassin: If all attacks are resolved against a single model, the Lictor may re-roll all to hit and to wound rolls.",
    "Chameleonic Skin: The model does not scatter when being set up via Deep Strike. Additionally, instead of using a \"Move & Shoot\" command, it always uses a \"Charge\" command and may still perform a 6\" Charge move after being set up via Deep Strike.",
    "Pheromone Trail: A friendly unit arriving within 6\" of this model via Deep strike does not scatter. The Lictor must be present on the table at the beginning of the battle round in order to use this rule.",
    "Neurolictor: Select one enemy unit during your activation. The target must pass a Leadership test or gain one Battleshock token."
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
  "min_cost": 117,
  "is_monster": false
};
