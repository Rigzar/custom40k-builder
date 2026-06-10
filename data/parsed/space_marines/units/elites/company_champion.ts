/**
 * COMPANY CHAMPION — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const companyChampion: Unit = {
  "name": "Company Champion",
  "models": [
    {
      "name": "Company Champion",
      "points": 50,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Chapter Champion",
      "points": 60,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Company Champion is a single character and equipped with: Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "One Company Champion per army may be upgraded to a Chapter Champion for +10 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Chapter Champion",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Command squad, They Shall Know No Fear",
    "Advisor: For every HQ selection, one Company Champion may be selected without taking up an Elite slot.",
    "Chapter Champion: Additionally, the model may re-roll 1 to wound roll per activation.",
    "Company Champion: The model may re-roll 1 to hit roll per activation.",
    "Honor or Death: At the start of the activation, if an enemy HQ or Character is within 12\", the placed Order is converted to Charge. The Company champion and an attached unit must use the Order to engage in close combat with the enemy HQ or character model."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 50
};
