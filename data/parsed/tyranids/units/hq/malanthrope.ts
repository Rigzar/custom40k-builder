/**
 * MALANTHROPE — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const malanthrope: Unit = {
  "name": "Malanthrope",
  "models": [
    {
      "name": "Malanthrope",
      "points": 99,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Malanthrope is equipped with: Grasping tail.",
  "weapons": [
    {
      "name": "Grasping tail",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
          "points": 15
        },
        {
          "name": "Hardened Carapace",
          "points": 31
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
      "constraint": {
        "type": "fixed_max",
        "max": 16
      },
      "choices": [
        { "name": "Acid Maw", "points": 5 },
        { "name": "Adrenal Glands", "points": 5 },
        { "name": "Enhanced Senses", "points": 5 },
        { "name": "Heightened Reflexes", "points": 5 },
        { "name": "Pathogenesis", "points": 5 },
        { "name": "Relentless Hunger", "points": 5 },
        { "name": "Toxin Sacs", "points": 5 },
        { "name": "Acid Blood", "points": 5 },
        { "name": "Extremely Volatile", "points": 5 },
        { "name": "Implant Attack", "points": 5 },
        { "name": "Infrasonic Roar", "points": 5 },
        { "name": "Resonance Barb", "points": 5 },
        { "name": "Symbiote Rippers", "points": 3 },
        { "name": "Thornback", "points": 5 },
        { "name": "Tusked", "points": 5 },
        { "name": "Warped", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fearless, Synapse",
    "Enhanced Sporecloud: Friendly models within 9\" benefit from Obscuring cover.",
    "Prey Adaption: The first time an enemy model is killed within 3\" of the model, all units of your army gain the \"Preferred Enemy\" ability against all enemy units.",
    "Psychic Barrier: The model gains a 5+ invulnerability save.",
    "Toxic Miasma: During its activation, the model inflicts 1 Mortal Wound on a 3+ against all enemy units within 3\"."
  ],
  "unit_type": "Character model, Monstrous Infantry",
  "keywords": [
    "Tyranid"
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
  "min_cost": 99,
  "is_monster": true
};
