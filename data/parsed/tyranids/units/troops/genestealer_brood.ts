/**
 * GENESTEALER BROOD â€” Troops
 *
 * SOURCE: TODO â€” add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: A Broodlord can cast 1 power and deny 1 power per battle round. It knows Smite and two powers from a chosen discipline."
 *   â†’ Cast/deny limit and discipline access must be derived from this text.
 *   â†’ ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const genestealerBrood: Unit = {
  "name": "Genestealer Brood",
  "models": [
    {
      "name": "Genestealer",
      "points": 15,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "6+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "5",
        "A": "3",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Broodlord",
      "points": 10,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "6+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "6",
        "A": "4",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Piercing claws.",
  "weapons": [
    {
      "name": "Piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to a Broodlord for +52 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 52,
      "variant_link": "Broodlord",
      "is_unique_per_army": false
    },
    {
      "header": "All models may be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Scything talons",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be upgraded to one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ymgarl Genestealers",
          "points": 0
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
          "name": "Scuttlers",
          "points": 1
        },
        {
          "name": "Feeder Tendrils",
          "points": 1
        },
        {
          "name": "Hardened Carapace",
          "points": 6
        },
        {
          "name": "Endless",
          "points": 16
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
    "Infiltrator, Move Through Cover",
    "Psyker: A Broodlord can cast 1 power and deny 1 power per battle round. It knows Smite and two powers from a chosen discipline.",
    "Ymgarl Genestealers: The unit loses the \"Infiltrate\" ability but may select one of the following improvements during each Reinforcement phase. The bonus is active until the end of the current battle round:\n- +1 Strength\n- +1 Toughness\n- +1 Attack"
  ],
  "unit_type": "Infantry",
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 75,
  "is_monster": false
};
