/**
 * SWARMLORD â€” HQ
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
 *   â†’ Cast/deny limit and discipline access must be derived from this text.
 *   â†’ ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const swarmlord: Unit = {
  "name": "Swarmlord",
  "models": [
    {
      "name": "Swarmlord",
      "points": 339,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "7",
        "T": "7",
        "W": "6",
        "I": "6",
        "A": "5",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Swarmlord is equipped with: Bone sabres.",
  "weapons": [
    {
      "name": "Bone sabres",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Deadly(5+)"
    },
    {
      "name": "Monstrous flesh hooks",
      "range": "6\"",
      "type": "Pistol 8",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Swarmlord per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Monstrous flesh hooks",
          "points": 13
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
          "name": "Norn Crown",
          "points": 10,
          "effect": {
            "grants_abilities": [
              "Norn Crown: The unit may cast and deny 1 more psychic power per battle round."
            ]
          }
        },
        {
          "name": "Regeneration",
          "points": 30,
          "effect": {
            "grants_abilities": [
              "Regeneration: The unit gains the \"Regeneration(1)\" ability."
            ]
          }
        },
        {
          "name": "Winged",
          "points": 53,
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
    }
  ],
  "abilities": [
    "Deflect, Fearless, Move Through Cover, Parry, Synapse",
    "Alien Cunning: A Swarmlord can decide once per game to get a +1/-1 modifier to rolls during the Reinforcement phase and/or a +1/-1 modifier during the Initiative phase. The ability may be used after rolls have been made by both players.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline.",
    "Swarm Leader: Select an ability during each activation: Counter-attack, Favoured enemy, or Tank hunter. The ability is active for the model and the attached unit until the next activation.",
    "Warp Barrier: The model gains a 4+ ward save."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid",
    "Advanced Bioform"
  ],
  "is_vehicle": false,
  "is_character": false,
  "armory_as_character": true,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 339,
  "is_monster": true
};
