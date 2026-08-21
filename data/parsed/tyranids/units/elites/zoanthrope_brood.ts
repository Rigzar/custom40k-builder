/**
 * ZOANTHROPE BROOD â€” Elites
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const zoanthropeBrood: Unit = {
  "name": "Zoanthrope Brood",
  "models": [
    {
      "name": "Zoanthrope",
      "points": 95,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Neurothrope",
      "points": 95,
      "min": 0,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Warp lightning.",
  "weapons": [
    {
      "name": "Warp lightning - Dispersed",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Explosive, Seeking"
    },
    {
      "name": "Warp lightning - Focused",
      "range": "18\"",
      "type": "Assault 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Seeking"
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
          "points": 4,
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
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
      "constraint": {
        "type": "fixed_max"
      },
      "choices": [
        {
          "name": "Acid Maw",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Acid Maw: The unit may re-roll one to wound roll in melee per battle round."
            ]
          }
        },
        {
          "name": "Adrenal Glands",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Adrenal Glands: The unit gains \"Haste(2\\\")\"."
            ]
          }
        },
        {
          "name": "Enhanced Senses",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Enhanced Senses: The unit gains the \"Acute Senses\" ability."
            ]
          }
        },
        {
          "name": "Heightened Reflexes",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Heightened Reflexes: If the unit has not already activated this turn, it may immediately use up its order and fire at an enemy unit within 18\" that is deployed as reinforcement as if it had been given the \"Stand & Shoot\" order. The attack resolves after the enemy unit has been deployed and before it takes another action."
            ]
          }
        },
        {
          "name": "Pathogenesis",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Pathogenesis: The unit adds +3\" to all of its ranged weapons."
            ]
          }
        },
        {
          "name": "Relentless Hunger",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Relentless Hunger: The unit gains +3\" for its Consolidation moves."
            ]
          }
        },
        {
          "name": "Toxin Sacs",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Toxin Sacs: The unit gains the \"Poison(4+)\" ability for all melee attacks."
            ],
            "stat_mod": [
              {
                "stat": "S",
                "delta": 1
              }
            ]
          }
        },
        {
          "name": "Acid Blood",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Acid Blood: The unit gains the \"Retribution(3)\" ability."
            ]
          }
        },
        {
          "name": "Extremely Volatile",
          "points": 0,
          "effect": {
            "grants_abilities": [
              "Extremely Volatile: The unit explodes like a vehicle upon losing their last Wound, resolved at Strength 7."
            ]
          }
        },
        {
          "name": "Implant Attack",
          "points": 5,
          "requires_keyword": "Advanced Bioform",
          "effect": {
            "grants_abilities": [
              "Implant Attack: The unit gains the \"Implant Attack\" weapon."
            ],
            "grants_weapons": [
              "Implant Attack"
            ]
          }
        },
        {
          "name": "Infrasonic Roar",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Infrasonic Roar: The unit gains the \"Suppression\" ability for all ranged attacks made against targets within 12\"."
            ]
          }
        },
        {
          "name": "Resonance Barb",
          "points": 5,
          "requires_keyword": "Advanced Bioform",
          "effect": {
            "grants_abilities": [
              "Resonance Barb: The unit gains +1 to all tests for manifesting a psychic power."
            ]
          }
        },
        {
          "name": "Symbiote Rippers",
          "points": 5,
          "requires_keyword": "Advanced Bioform",
          "effect": {
            "grants_abilities": [
              "Symbiote Rippers: The unit gains the \"Symbiote Rippers\" weapon."
            ],
            "grants_weapons": [
              "Symbiote Rippers"
            ]
          }
        },
        {
          "name": "Thornback",
          "points": 5,
          "requires_keyword": "Advanced Bioform",
          "effect": {
            "grants_abilities": [
              "Thornback: The unit doubles the final combat result for its own army in each melee in which it participates."
            ]
          }
        },
        {
          "name": "Tusked",
          "points": 5,
          "requires_keyword": "Advanced Bioform",
          "effect": {
            "grants_abilities": [
              "Tusked: The unit gains +1 additional attack as a Charge bonus."
            ]
          }
        },
        {
          "name": "Warped",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Warped: The unit gains the ability \"Terrifying(-1)\"."
            ]
          }
        },
        {
          "name": "Camouflage",
          "points": 5,
          "effect": {
            "grants_abilities": [
              "Camouflage: The unit gains the benefit of light cover until its first activation."
            ]
          }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "independent_choices": true
    },
    {
      "header": "One model may be upgraded to a Neurothrope for +25 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 25,
      "variant_link": "Neurothrope",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fearless, Massive(1), Synapse",
    "Warp Barrier: The model gains a 4+ ward save.",
    "Psyker: The Neurothrope can cast 1 power and deny 1 power per battle round. It knows Smite and one powers from a chosen discipline."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid",
    "Advanced Bioform"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 95,
  "is_monster": false
};
