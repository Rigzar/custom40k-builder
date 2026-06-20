/**
 * WARP SPIDERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const warpSpiders: Unit = {
  "name": "Warp Spiders",
  "models": [
    {
      "name": "Warp Spider",
      "points": 32,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "12\"",
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
      "name": "Warp Spider Exarch",
      "points": 61,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
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
  "equipped_with": "Every model is equipped with: Death spinner.",
  "weapons": [
    {
      "name": "Death spinner",
      "range": "12\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Armor piercing(5+), Monofilament, Suppression"
    },
    {
      "name": "Powerblades",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(2), Shred, Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +29 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 29,
      "variant_link": "Warp Spider Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can be equipped with a second Death spinner for +8 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 8,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can additionally be equipped with Powerblades for +10 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": null,
      "is_unique_per_army": false
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
    "Aspect armor: The model gains a 5+ invulnerability save.",
    "Shunting: The unit rolls and moves an additional 1D6 when using the Advance order. If a double 1 is rolled, the unit suffers one Mortal Wound."
  ],
  "unit_type": "Jump Pack Infantry",
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 160
};
