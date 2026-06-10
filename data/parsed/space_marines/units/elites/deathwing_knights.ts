/**
 * DEATHWING KNIGHTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deathwingKnights: Unit = {
  "name": "Deathwing Knights",
  "models": [
    {
      "name": "Knight",
      "points": 63,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    },
    {
      "name": "Knight Master",
      "points": 68,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Power sword; Storm shield.",
  "weapons": [
    {
      "name": "Flail of the Unforgiven",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Deflagrate(2+)"
    },
    {
      "name": "Mace of Absolution",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Relic blade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may replace their Power sword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Mace of Absolution",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Knight Master may replace his Power sword",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Relic blade",
          "points": 7
        },
        {
          "name": "Flail of the Unforgiven",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, Deep Strike,Massive(1), They Shall Know No Fear",
    "Terminator armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "armourKeyword": "Terminator",
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 320
};
