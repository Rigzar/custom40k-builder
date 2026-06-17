/**
 * HOWLING BANSHEES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const howlingBanshees: Unit = {
  "name": "Howling Banshees",
  "models": [
    {
      "name": "Howling Banshee",
      "points": 25,
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
      "name": "Howling Banshee Exarch",
      "points": 46,
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
  "equipped_with": "Every model is equipped with: Banshee blade; Shuriken pistol.",
  "weapons": [
    {
      "name": "Banshee blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Executioner",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "Unwieldy"
    },
    {
      "name": "Mirrorswords",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Flurry(2), Unwieldy"
    },
    {
      "name": "Shuriken pistol",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Triskele - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Triskele - Shooting",
      "range": "12\"",
      "type": "Pistol 3",
      "s": "4",
      "ap": "-4",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to an Exarch for +21 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 21,
      "variant_link": "Howling Banshee Exarch",
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Banshee blade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Executioner",
          "points": 8
        },
        {
          "name": "Triskele",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can swap their Shuriken pistol and Banshee blade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Mirrorswords",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Exarch can gain one Exarch Power.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus, Deflect, Furious Charge, Parry, <Aspect>",
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
  "min_cost": 125
};
