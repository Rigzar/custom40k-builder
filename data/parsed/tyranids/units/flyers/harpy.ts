/**
 * HARPY â€” Flyers
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const harpy: Unit = {
  "name": "Harpy",
  "models": [
    {
      "name": "Harpy",
      "points": 177,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "5",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Harpy is equipped with: Twin venom cannon; Spore Mine cysts.",
  "weapons": [
    {
      "name": "Spore Mine cysts",
      "range": "6\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Bomb, Blast(4), Indirect, Suppression(3)"
    },
    {
      "name": "Stinger salvo",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
    },
    {
      "name": "Twin stranglethorn cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "AT(1), Blast(6), Suppression(3)"
    },
    {
      "name": "Twin venom cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Blast(4)"
    }
  ],
  "option_groups": [
    {
      "header": "May replace its Twin venom cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin stranglethorn cannon",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Twin venom cannon"
      ]
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Stinger salvo",
          "points": 22
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
          "name": "Synaptic Node",
          "points": 15,
          "effect": {
            "grants_abilities": [
              "Synaptic Node: The unit gains the \"Fearless\" and \"Synapse\" abilities. Only a single unit per army may take this Biomorph."
            ]
          }
        },
        {
          "name": "Regeneration",
          "points": 25,
          "effect": {
            "grants_abilities": [
              "Regeneration: The unit gains the \"Regeneration(1)\" ability."
            ]
          }
        },
        {
          "name": "Hardened Carapace",
          "points": 28,
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
          "points": 13,
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
    "Hover Mode, Instinctive Behaviour, Squadron",
    "Spore Mine Launcher: Instead of shooting at an enemy, a Harpy may create a unit of \"Spore Mine Cluster\" (3 models) within 48\" of itself and at least 9\" away from any enemy unit."
  ],
  "unit_type": "Flyer, Monstrous Creature",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 177,
  "is_monster": true
};
