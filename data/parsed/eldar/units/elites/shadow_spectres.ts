/**
 * SHADOW SPECTRES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const shadowSpectres: Unit = {
  "name": "Shadow Spectres",
  "models": [
    {
      "name": "Shadow Spectre",
      "points": 41,
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
      "name": "Shadow Spectre Exarch",
      "points": 67,
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
  "equipped_with": "Every model is equipped with: Haywire grenade; Plasma grenade; Prism rifle.",
  "weapons": [
    {
      "name": "Haywire grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "AT(2), Haywire"
    },
    {
      "name": "Haywire launcher",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2), Haywire"
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
      "name": "Prism blaster",
      "range": "18\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Ghostlight"
    },
    {
      "name": "Prism rifle - Dispersed",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Prism rifle - Focused",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Ghostlight"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +26 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 26,
      "variant_link": "Shadow Spectre Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Prism rifle",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Haywire launcher",
          "points": 2
        },
        {
          "name": "Prism blaster",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Prism rifle - Dispersed", "Prism rifle - Focused"]
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
    "Battle Focus, Deflect, Terrifying(-1), <Aspect>",
    "Aspect armor: The model gains a 5+ invulnerability save.",
    "Ghostlight: If a unit scores two or more hits with weapons with this ability, you may resolve the hits normally or inflict a single combined attack. When combining attacks, choose one Ghostlight hit to be the primary hit. Resolve only the primary hit; for each other Ghostlight hit, the primary hit gains +1 Strength, -1 AP, +1 Damage, and AT(1), to a maximum of 10 Strength, -6 AP, 4 Damage, and AT(4)."
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 205
};
