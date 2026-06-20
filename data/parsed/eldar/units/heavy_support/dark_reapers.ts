/**
 * DARK REAPERS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const darkReapers: Unit = {
  "name": "Dark Reapers",
  "models": [
    {
      "name": "Dark Reaper",
      "points": 59,
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
      "name": "Dark Reaper Exarch",
      "points": 64,
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
  "equipped_with": "Every Dark Reaper is equipped with: Aeldari missile launcher.",
  "weapons": [
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Tempest launcher",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Indirect fire, Suppression"
    },
    {
      "name": "Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    },
    {
      "name": "Reaper missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Reaper missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Dark Reaper Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Shuriken cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Tempest launcher",
          "points": 18
        },
        {
          "name": "Aeldari missile launcher",
          "points": 26
        },
        {
          "name": "Reaper missile launcher",
          "points": 77
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Shuriken cannon"]
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
    "Battle Focus, Unyielding, <Aspect>",
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
  "slot": "Heavy Support",
  "default_size": 5,
  "min_cost": 295
};
