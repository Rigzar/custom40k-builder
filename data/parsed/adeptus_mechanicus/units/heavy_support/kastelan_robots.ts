/**
 * KASTELAN ROBOTS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kastelanRobots: Unit = {
  "name": "Kastelan Robots",
  "models": [
    {
      "name": "Kastelan Robot",
      "points": 105,
      "min": 2,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "6",
        "T": "7",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Incendine combustor; 2 Power fists.",
  "weapons": [
    {
      "name": "Heavy phosphor blaster",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Luminagen"
    },
    {
      "name": "Incendine combustor",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Power fist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Twin heavy phosphor blaster",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Luminagen"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their two Power fists",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin heavy phosphor blaster",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Power fist"]
    },
    {
      "header": "Any model may swap their Incendine combustor",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy phosphor blaster",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Incendine combustor"]
    }
  ],
  "abilities": [
    "Monotask, Unyielding",
    "Battle Protocols: Select one Battle Protocol during each activation:",
    "- Aegis: All models in the unit gain +1 Toughness. This is the default selection in the first battle round until the first actual activation.",
    "- Conqueror: All models in the unit gain +1 WS.",
    "- Protector: All models in the unit gain +1 BS.",
    "Repulsor Grid: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [],
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
  "default_size": 2,
  "min_cost": 210
};
