/**
 * RANGERS — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const rangers: Unit = {
  "name": "Rangers",
  "models": [
    {
      "name": "Ranger",
      "points": 33,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Ranger is equipped with: Ranger long rifle; Shuriken pistol.",
  "weapons": [
    {
      "name": "Ranger long rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
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
      "header": "For every 5 Rangers, 1 model can be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gloom field",
          "points": 5
        },
        {
          "name": "Wireweave net",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Battle Focus, Infiltrator, Move through cover, Use cover",
    "Gloom field: Enemies that target the unit and are at least 12\" away from it reduce their weapon range by 6\".",
    "Pathfinder ambush: Once an enemy unit emerges from reserve, a Ranger unit in reserve may perform an intercept. The unit is immediately deployed within 18\" but at least 9\" of the enemy reserve unit. The Rangers can then fire at that unit as if they had been given the \"Stand & Shoot\" order. The attack resolves after the enemy unit has been deployed and before it takes another action.",
    "Wireweave net: Once per game, after this unit used Defensive fire, the attacker suffers 1D6+1 automatic wounds and reduces their charging range by 2\"."
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 165
};
