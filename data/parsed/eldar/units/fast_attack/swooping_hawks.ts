/**
 * SWOOPING HAWKS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const swoopingHawks: Unit = {
  "name": "Swooping Hawks",
  "models": [
    {
      "name": "Swooping Hawk",
      "points": 37,
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
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Swooping Hawk Exarch",
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
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Lasblaster; Haywire grenade; Plasma grenade.",
  "weapons": [
    {
      "name": "Hawk's talon",
      "range": "24\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Precision(5+)"
    },
    {
      "name": "Haywire grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Lasblaster",
      "range": "24\"",
      "type": "Assault 3",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Precision(5+)"
    },
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +24 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 24,
      "variant_link": "Swooping Hawk Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Lasblaster",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hawk's talon",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Lasblaster"]
    },
    {
      "header": "The Exarch can be equipped with a Power sword for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
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
    "Sky Dive: Once per game, at the start of their activation, the unit may use a Stand & Shoot order to be immediately re-deployed anywhere on the battlefield. They must keep a minimum distance of 6\" to enemy models."
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
  "min_cost": 185
};
