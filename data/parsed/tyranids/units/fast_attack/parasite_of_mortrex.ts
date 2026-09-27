/**
 * PARASITE OF MORTREX â€” Fast Attack
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const parasiteOfMortrex: Unit = {
  "name": "Parasite of Mortrex",
  "models": [
    {
      "name": "Parasite of Mortrex",
      "points": 76,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Barbed ovipositor; Clawed limbs.",
  "weapons": [
    {
      "name": "Barbed ovipositor",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "2",
      "abilities": "Extra Attack(1), Limit(1)"
    },
    {
      "name": "Clawed limbs",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Extra Attack(2)"
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
          "name": "Regeneration",
          "points": 9,
          "effect": {
            "grants_abilities": [
              "Regeneration: The unit gains the \"Regeneration(1)\" ability."
            ]
          }
        },
        {
          "name": "Hardened Carapace",
          "points": 17,
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
          "points": 8,
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
    "Fearless, Squadron, Synapse",
    "Parasitic infestation: The model may only make a single attack with the Barbed ovipositor per activation. If it successfully wounds the target (before any save rolls), roll 1D3. The target suffers the result in Mortal Wounds in addition to the normal damage and you may spawn the same amount of Ripper Swarms (as one unit) in direct base contact with the Parasite of Mortrex and/or the enemy unit, if it still has models left."
  ],
  "unit_type": "Jump Pack Infantry",
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 76,
  "is_monster": false
};
