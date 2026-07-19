/**
 * NORN â€” Heavy Support
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from a chosen discipline."
 *   â†’ Cast/deny limit and discipline access must be derived from this text.
 *   â†’ ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const norn: Unit = {
  "name": "Norn",
  "models": [
    {
      "name": "Norn",
      "points": 340,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "8",
        "T": "8",
        "W": "7",
        "I": "5",
        "A": "5",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Norn is equipped with: Monstrous scything talons; Monstrous piercing claws.",
  "weapons": [
    {
      "name": "Crushing claws",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Monstrous flesh hooks",
      "range": "6\"",
      "type": "Pistol 8",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Monstrous piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1)"
    },
    {
      "name": "Monstrous scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Flurry(1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap its Monstrous piercing claws",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Crushing claws",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Monstrous piercing claws"]
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
      "header": "May be upgraded to one of the following specialisation",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Norn Emissary",
          "points": 45
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
          "name": "Regeneration",
          "points": 35
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
    "Fearless, Move Through Cover, Synapse",
    "Psychic Barrier: The model gains a 5+ invulnerability save.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from a chosen discipline.",
    "Singular Purpose: Select one enemy unit at the beginning of the first Battle round. The model may re-roll all to hit and all to wound rolls against the target. Alternatively, select a mission objective at the beginning of the first Battle round. The model gains the \"Objective Secured!\" ability for this objective only. Additionally, it may re-roll armor save and invulnerability saves of 1 while within 3\" of that objective.",
    "Norn Emissary",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and two powers from a chosen discipline.",
    "Warp Barrier: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 340,
  "is_monster": true
};
