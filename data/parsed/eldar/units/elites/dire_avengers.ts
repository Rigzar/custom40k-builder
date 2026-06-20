/**
 * DIRE AVENGERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const direAvengers: Unit = {
  "name": "Dire Avengers",
  "models": [
    {
      "name": "Dire Avenger",
      "points": 29,
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
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Dire Avenger Exarch",
      "points": 40,
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
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every Dire Avenger is equipped with: Avenger shuriken catapult; Plasma grenade.",
  "weapons": [
    {
      "name": "Avenger shuriken catapult",
      "range": "18\"",
      "type": "Assault 3",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Diresword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Deadly(5+)"
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
      "name": "Power glaive",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Shuriken pistol",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": "Dire Avenger Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Diresword and Shuriken pistol",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Power glaive & Shuriken pistol",
          "points": 0
        },
        {
          "name": "Avenger shuriken catapult",
          "points": 10
        },
        {
          "name": "2 Avenger shuriken catapults",
          "points": 28
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Diresword", "Shuriken pistol"]
    },
    {
      "header": "The Exarch can be equipped with: +5 points Shimmershield.",
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
    "Shimmershield: The model and its attached unit gain a 4+ invulnerability save in melee."
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
  "min_cost": 145
};
