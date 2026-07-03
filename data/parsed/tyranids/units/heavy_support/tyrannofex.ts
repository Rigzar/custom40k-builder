/**
 * TYRANNOFEX — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tyrannofex: Unit = {
  "name": "Tyrannofex",
  "models": [
    {
      "name": "Tyrannofex",
      "points": 225,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "T": "8",
        "W": "7",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Acid spray; Monstrous scything talons; Stinger salvo.",
  "weapons": [
    {
      "name": "Acid spray",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Desiccator larvae",
      "range": "9\"",
      "type": "Assault 4",
      "s": "1",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(2+)"
    },
    {
      "name": "Electroshock grubs",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Fleshborer hive",
      "range": "18\"",
      "type": "Assault 20",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Rupture cannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Shreddershard beetles",
      "range": "9\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "-1",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Stinger salvo",
      "range": "24\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Acid spray",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Fleshborer hive",
          "points": 50
        },
        {
          "name": "Rupture cannon",
          "points": 118
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Acid spray"]
    },
    {
      "header": "Each model may be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Desiccator larvae",
          "points": 7
        },
        {
          "name": "Shreddershard beetles",
          "points": 9
        },
        {
          "name": "Electroshock grubs",
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
          "name": "Regeneration",
          "points": 35
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
  "min_cost": 225,
  "is_monster": true
};
