/**
 * TRYGON — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const trygon: Unit = {
  "name": "Trygon",
  "models": [
    {
      "name": "Trygon",
      "points": 174,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "7",
        "W": "6",
        "I": "4",
        "A": "4",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bio-electric pulse; 2 Monstrous scything talons.",
  "weapons": [
    {
      "name": "Bio-electric pulse",
      "range": "12\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Deflagrate(5+)"
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
      "name": "Prehensile pincer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Extra Attack(1)"
    },
    {
      "name": "Toxinspike",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "3",
      "abilities": "Extra Attack(1), Poison(2+)"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may be equipped with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Prehensile pincer",
          "points": 16
        },
        {
          "name": "Toxinspike",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each Trygon may be upgraded to one of the following specialisation",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Trygon Prime",
          "points": 15
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
          "name": "Hardened Carapace",
          "points": 27
        },
        {
          "name": "Regeneration",
          "points": 30
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May select any number of Biomorphs (see list below).",
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
    "Deep Strike, Instinctive Behaviour, Move Through Cover, Parry, Squadron",
    "Burrow: The model may use a \"Stand & Shoot\" order to be immediately removed from the battlefield and deployed via Deep Strike rules.",
    "Trygon Prime: The model gains the \"Fearless\" and \"Synapse\" abilities. Additionally, its Bio-electric pulse weapon gains the \"Assault 12\" type."
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 174,
  "is_monster": false
};
