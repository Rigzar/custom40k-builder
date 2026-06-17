/**
 * AUTARCH — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const autarch: Unit = {
  "name": "Autarch",
  "models": [
    {
      "name": "Autarch",
      "points": 43,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "6",
        "A": "3",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Exalted Autarch",
      "points": 58,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "6",
        "A": "4",
        "LD": "9",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "An Autarch is equipped with: Plasma grenade.",
  "weapons": [
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Autarch per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "One Autarch per army can be upgraded to an Exalted Autarch for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Exalted Autarch",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Battle Focus",
    "Perfected warfare: An Autarch can decide once per game to get a +1/-1 modifier to rolls during the Reinforcement phase and/or a +1/-1 modifier during the Initiative phase. The ability may be used after rolls have been made by both players.",
    "Exalted Autarch: The Autarch may use Perfected warfare twice per game."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 43
};
