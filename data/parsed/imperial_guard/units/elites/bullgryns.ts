/**
 * BULLGRYNS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bullgryns: Unit = {
  "name": "Bullgryns",
  "models": [
    {
      "name": "Bullgryn",
      "points": 53,
      "min": 2,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Bullgryn Bone'ead",
      "points": 53,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bullgryn maul; Brute shield; Frag bombs.",
  "weapons": [
    {
      "name": "Bullgryn maul",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(2)"
    },
    {
      "name": "Frag bomb",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grenadier gauntlet",
      "range": "18\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Brute shield for a Plate shield for +17 points each.",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Plate shield",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any model may swap their Bullgryn maul for a Grenadier gauntlet for +17 points.",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Grenadier gauntlet",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bullgryn maul"]
    }
  ],
  "abilities": [
    "Furious Charge, Massive(1)",
    "Brute shield: The model gains the abilities \"Deflect\" and \"Parry\".",
    "Plate shield: The model gains +2 to armor rolls."
  ],
  "unit_type": "Infantry",
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
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 159
};
