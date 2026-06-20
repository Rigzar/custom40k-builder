/**
 * FIRE DRAGONS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fireDragons: Unit = {
  "name": "Fire Dragons",
  "models": [
    {
      "name": "Fire Dragon",
      "points": 53,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Fire Dragon Exarch",
      "points": 55,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every Fire Dragon is equipped with: Dragon fusion gun.",
  "weapons": [
    {
      "name": "Dragon fusion gun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(2)"
    },
    {
      "name": "Dragon's breath flamer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Firepike",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "Armorbane, AT(4)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +2 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 2,
      "variant_link": "Fire Dragon Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Dragon's breath flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Dragon fusion gun",
          "points": 29
        },
        {
          "name": "Firepike",
          "points": 53
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Dragon's breath flamer"]
    },
    {
      "header": "The Exarch can gain one Exarch Power",
      "constraint": {
        "type": "one"
      },
      "choices": [
        { "name": "Bladestorm", "points": 5 },
        { "name": "Burning heat", "points": 5 },
        { "name": "Crack shot", "points": 5 },
        { "name": "Crushing blows", "points": 5 },
        { "name": "Defensive stance", "points": 5 },
        { "name": "Dragon's bite", "points": 5 },
        { "name": "Graceful avoidance", "points": 5 },
        { "name": "Heartstrike", "points": 5 },
        { "name": "Lightning attacks", "points": 5 },
        { "name": "Piercing strike", "points": 5 },
        { "name": "Rapid redeployment", "points": 5 },
        { "name": "Reaper's reach", "points": 5 },
        { "name": "Scorpion's sting", "points": 5 },
        { "name": "Skyhunter", "points": 5 },
        { "name": "Stand firm", "points": 5 },
        { "name": "Surprise assault", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Battle Focus, <Aspect>",
    "Aspect armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Aspect"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 265
};
