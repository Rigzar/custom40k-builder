/**
 * HIVE CRONE — Flyers
 *
 * SOURCE: Codex/Tyranids 1.05.ods, sheet "Hive Crone" (new in the September 2026 update). Verbatim:
 *
 *   1  Hive Crone  12"  3+ 3+  S6 T6 W5 I5 A4 Ld7 Sv4+   166 pts
 *   A Hive Crone is equipped with: Drool cannon; Monstrous scything talons; 4 Tentaclids.
 *
 *   Drool cannon                18"  Assault 6  6  -2  1   Auto Hit, Sunder(1), Monofilament
 *   Monstrous scything talons   -    Melee      U  -2  2   Extra Attack(1)
 *   Stinger salvo               24"  Assault 2  5   0  1   Blast(4)
 *   Tentaclids                  36"  Assault 1  5  -1  1   Ammo(1), Haywire, Seeking
 *
 *   OPTIONS
 *   • May be equipped with one of the following: Stinger salvo +22
 *   • May select one Special Biomorph: Resonator +13 / Synaptic Node +15 / Regeneration +25 /
 *     Hardened Carapace +28
 *   • May additionally select any number of Basic and Advanced Biomorphs (see Armory).
 *
 *   ABILITIES: Hover Mode
 *   UNIT TYPE: Flyer, Monstrous Creature
 *   KEYWORDS: Advanced Bioform
 *
 * ABILITY VOCABULARY: the sheet writes this datasheet in the POST-clean-up names (Auto Hit,
 * Sunder(1), Extra Attack(1), Blast(4)). Every other weapon in the app is still on the pre-clean-up
 * names, and the clean-up has to land atomically across all ~1400 profiles, so this unit is stored
 * in the SAME vocabulary as its neighbours — Flames, Flurry(1), Explosive — using the author's own
 * mapping. It gets renamed with everything else. A weapon written in a vocabulary no other weapon
 * shares would look broken on the card today.
 */

import type { Unit } from '../../../../../src/types/data';

export const hiveCrone: Unit = {
  "name": "Hive Crone",
  "models": [
    {
      "name": "Hive Crone",
      "points": 166,
      "min": 1,
      "max": 1,
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
  "equipped_with": "A Hive Crone is equipped with: Drool cannon; Monstrous scything talons; 4 Tentaclids.",
  "weapons": [
    {
      "name": "Drool cannon",
      "range": "18\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1), Monofilament"
    },
    {
      "name": "Monstrous scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Extra Attack(1)"
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
      "name": "Tentaclids",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Ammo(1), Haywire, Seeking"
    }
  ],
  "option_groups": [
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
          "name": "Resonator",
          "points": 13
        },
        {
          "name": "Synaptic Node",
          "points": 15
        },
        {
          "name": "Regeneration",
          "points": 25
        },
        {
          "name": "Hardened Carapace",
          "points": 28
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
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
              "Infrasonic Roar: All ranged weapons in the unit gain the \"Suppression(3)\" ability against targets within 12\". Basic Bioforms only gain \"Suppression(2)\"."
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
    "Hover Mode"
  ],
  "unit_type": "Flyer, Monstrous Creature",
  "keywords": [
    "Advanced Bioform"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 166
};
