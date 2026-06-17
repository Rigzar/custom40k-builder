/**
 * SCOURGES — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const scourges: Unit = {
  "name": "Scourges",
  "models": [
    {
      "name": "Scourge",
      "points": 34,
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
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Solarite",
      "points": 44,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Shardcarbine; Plasma grenade.",
  "weapons": [
    {
      "name": "Blaster",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Lance(+1)"
    },
    {
      "name": "Dark lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Haywire blaster",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Haywire"
    },
    {
      "name": "Heat lance",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-5",
      "d": "1",
      "abilities": "Lance(+2), Melta"
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
      "name": "Shardcarbine",
      "range": "18\"",
      "type": "Assault 3",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    },
    {
      "name": "Shredder",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Suppression"
    },
    {
      "name": "Splinter cannon",
      "range": "36\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, two Scourges may swap their Shardcarbines",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Haywire blaster",
          "points": 0
        },
        {
          "name": "Shredder",
          "points": 2
        },
        {
          "name": "Heat lance",
          "points": 8
        },
        {
          "name": "Splinter cannon",
          "points": 9
        },
        {
          "name": "Blaster",
          "points": 18
        },
        {
          "name": "Dark lance",
          "points": 42
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Solarite for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Solarite",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Power through Pain",
    "Ghostplate armor: The unit got a 5+ invulnerability save.",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORDS to the unit."
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [
    "-"
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
  "min_cost": 170
};
