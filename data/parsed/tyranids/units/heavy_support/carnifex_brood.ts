/**
 * CARNIFEX BROOD — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const carnifexBrood: Unit = {
  "name": "Carnifex Brood",
  "models": [
    {
      "name": "Carnifex",
      "points": 106,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "7",
        "W": "5",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 2 Monstrous scything talons.",
  "weapons": [
    {
      "name": "Bio plasma",
      "range": "12\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-4",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Bone mace",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Extra Attack(1)"
    },
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
      "name": "Heavy venom cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Monstrous scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Spine banks",
      "range": "6\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Supression"
    },
    {
      "name": "Stranglethorn cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "AT(1), Barrage, Suppression"
    },
    {
      "name": "Thresher scythe",
      "range": "-",
      "type": "Melee",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Deflagrate(5+), Flurry(3)"
    },
    {
      "name": "Twin deathspitter with slimer maggots",
      "range": "24\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin devourer with brainleech worms",
      "range": "18\"",
      "type": "Rapid Fire 4",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Shred"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap one of their Monstrous scything talons",
      "constraint": {
        "type": "every"
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
      "replaces": ["Monstrous scything talons"]
    },
    {
      "header": "Each model may swap one of their Monstrous scything talons",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin devourer with brainleech worms",
          "points": 3
        },
        {
          "name": "Stranglethorn cannon",
          "points": 14
        },
        {
          "name": "Twin deathspitter with slimer maggots",
          "points": 19
        },
        {
          "name": "Heavy venom cannon",
          "points": 90
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Monstrous scything talons"]
    },
    {
      "header": "Each model may be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Spine banks",
          "points": 7
        },
        {
          "name": "Bio plasma",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Thresher scythe",
          "points": 6
        },
        {
          "name": "Bone mace",
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
          "name": "Synaptic Node",
          "points": 15
        },
        {
          "name": "Hardened Carapace",
          "points": 21
        },
        {
          "name": "Regeneration",
          "points": 25
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
    "Instinctive Behaviour, Move Through Cover, Squadron"
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Tyranid"
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 106,
  "is_monster": true
};
