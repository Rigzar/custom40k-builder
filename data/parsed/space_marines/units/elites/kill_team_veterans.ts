/**
 * KILL TEAM VETERANS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const killTeamVeterans: Unit = {
  "name": "Kill Team Veterans",
  "models": [
    {
      "name": "Veteran",
      "points": 37,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Watch Sergeant",
      "points": 37,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Frag cannon (Frag round)",
      "range": "9\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Armor piercing(5+), Explosive"
    },
    {
      "name": "Frag cannon (Solid round)",
      "range": "24\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1)"
    },
    {
      "name": "Infernus heavy bolter (Heavy bolter)",
      "range": "24\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Infernus heavy bolter (Heavy flamer)",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "Up to four Veterans may select a weapon",
      "constraint": {
        "type": "fixed_max",
        "max": 4
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 13
        },
        {
          "name": "Heavy bolter",
          "points": 18
        },
        {
          "name": "Infernus heavy bolter",
          "points": 22
        },
        {
          "name": "Frag cannon",
          "points": 35
        },
        {
          "name": "Missile launcher",
          "points": 41
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to three models that are equipped with a Power fist, a Storm bolter and Terminator armor may take any upgrade from the Terminator Squad datasheet at the given cost.",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear",
    "Kill Team: At the start of the Deployment phase, choose a battlefield role (HQ, Troops, Elite, Fast Attack, Heavy Support). The Kill Team may re-roll one to-hit and one to-wound roll per activation against enemy units of that battlefield role."
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
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 185
};
