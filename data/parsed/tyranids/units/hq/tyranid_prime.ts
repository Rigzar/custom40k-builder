/**
 * TYRANID PRIME â€” HQ
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tyranidPrime: Unit = {
  "name": "Tyranid Prime",
  "models": [
    {
      "name": "Tyranid Prime",
      "points": 86,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "2",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tyranid Prime is equipped with: Scything talons; Spinefists.",
  "weapons": [
    {
      "name": "Boneswords",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+), Extra Attack(1)"
    },
    {
      "name": "Deathspitter",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Devourer",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lash whip and Bonesword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+), Quick(+1)"
    },
    {
      "name": "Rending claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Rending(5+)"
    },
    {
      "name": "Scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Extra Attack(1)"
    },
    {
      "name": "Spinefists",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "May swap its Scything talons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Rending claws",
          "points": 3
        },
        {
          "name": "Boneswords",
          "points": 6
        },
        {
          "name": "Lash whip and Bonesword",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Scything talons"
      ]
    },
    {
      "header": "May swap its Spinefists",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Scything talons",
          "points": 0
        },
        {
          "name": "Devourer",
          "points": 2
        },
        {
          "name": "Deathspitter",
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
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Leaping",
          "points": 12,
          "effect": {
            "grants_abilities": [
              "Leaping: The unit gains the \"Frenzy(6\")\" ability."
            ]
          }
        },
        {
          "name": "Regeneration",
          "points": 12,
          "effect": {
            "grants_abilities": [
              "Regeneration: The unit gains the \"Regeneration(1)\" ability."
            ]
          }
        },
        {
          "name": "Winged",
          "points": 14,
          "effect": {
            "grants_abilities": [
              "Winged: The unit gains \"Anti-Grav\" and \"Deep Strike\"."
            ],
            "stat_mod": [
              {
                "stat": "M",
                "delta": 6
              }
            ]
          }
        },
        {
          "name": "Hardened Carapace",
          "points": 18,
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
          "points": 9,
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
    "Fearless, Massive(1), Move Through Cover, Synapse",
    "Alpha Warrior: A Tyranid Prime can attach to any unit like a character model. If the model is attached to a unit of Tyranid Warriors, they gain a +1 bons to Weapon Skill and Ballistic Skill."
  ],
  "unit_type": "Character model, Monstrous Infantry",
  "keywords": [
    "Tyranid",
    "Advanced Bioform"
  ],
  "is_vehicle": false,
  "is_character": true,
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
  "min_cost": 86,
  "is_monster": false
};
