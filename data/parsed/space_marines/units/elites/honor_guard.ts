/**
 * HONOR GUARD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const honorGuard: Unit = {
  "name": "Honor Guard",
  "models": [
    {
      "name": "Honor Guard",
      "points": 36,
      "min": 1,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Frag grenades; Krak grenades.",
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
      "header": "For every HQ selection, the army may include one Honor Guard unit.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Inner Circle",
          "points": 1
        },
        {
          "name": "Vanguard",
          "points": 1
        },
        {
          "name": "Sanguine Guard",
          "points": 2
        },
        {
          "name": "Sword Brethren",
          "points": 2
        },
        {
          "name": "Wolf Guard",
          "points": 2
        },
        {
          "name": "Sternguard",
          "points": 3
        },
        {
          "name": "Bladeguard",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear",
    "Upgrades:",
    "Bladeguard: The model gains the \"Warded\" ability. Only for Infantry.",
    "Inner Circle: Enemy units that are fleeing from close combat and get caught receive double the amount of automatic hits from this model.",
    "Sanguine Guard: The model rolls 1D6 less for scatter, when it is deployed via the rules for Deep Strike.",
    "Sternguard: The model may shoot \"Rapid Fire\" weapons at full range with a \"Move & Shoot\" command and reduces its total penalty to hit rolls in ranged combat by -1, down to a minimum of 0.",
    "Sword Brethren: The model gains the \"Deadly(5+)\" ability for melee attacks.",
    "Vanguard: The model gains +1\" range for charge moves.",
    "Wolf Guard: The model gains the \"Bodyguard\", \"Command squad\" and \"Squadron\" abilities. The model gains the \"Character\" unit type."
  ],
  "unit_type": "Infantry",
  "keywords": [],
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
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 36
};
