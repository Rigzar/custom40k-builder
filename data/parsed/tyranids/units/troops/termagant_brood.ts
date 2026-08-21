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
      "abilities": "Explosive"
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
      "abilities": "Flames, Monofilament"
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
          "points": 3,
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
              "Acid Blood: The unit gains the \"Retribution(1)\" ability."
            ]
          }
        },
        {
          "name": "Extremely Volatile",
          "points": 0,
          "effect": {
            "grants_abilities": [
              "Extremely Volatile: The unit explodes like a vehicle upon losing their last Wound."
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
    "Combat Squads, Instinctive Behaviour, Move Through Cover"
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
  "champion_has_armory": false,
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
