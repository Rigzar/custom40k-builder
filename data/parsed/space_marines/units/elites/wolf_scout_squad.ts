/**
 * WOLF SCOUT SQUAD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wolfScoutSquad: Unit = {
  "name": "Wolf Scout Squad",
  "models": [
    {
      "name": "Wolf Scout",
      "points": 25,
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
        "SV": "4+"
      }
    },
    {
      "name": "Scout Sergeant",
      "points": 35,
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
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Combat knife; Frag grenades; Bolt pistol; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes shotgun",
      "range": "18\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Boltgun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combat knife",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Sniper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
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
      "abilities": "AT(1), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Every Wolf Scout may swap their Combat knife",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Astartes shotgun",
          "points": 2
        },
        {
          "name": "Boltgun",
          "points": 2
        },
        {
          "name": "Sniper rifle",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combat knife"]
    },
    {
      "header": "One Wolf Scout may swap their Combat knife",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 2
        },
        {
          "name": "Heavy bolter",
          "points": 14
        },
        {
          "name": "Melta",
          "points": 14
        },
        {
          "name": "Plasma gun",
          "points": 19
        },
        {
          "name": "Missile launcher",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Two Wolf Scouts may swap their Bolt pistol",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Power sword",
          "points": 5
        },
        {
          "name": "Plasma pistol",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The whole squad may be equipped with Camo cloaks for +11 points per model.",
      "constraint": {
        "type": "every"
      },
      "choices": [],
      "inline_pts": 11,
      "per_model": true,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, Infiltrator, They Shall Know No Fear",
    "Camo cloak: The model gains the \"Stealth\" ability.",
    "Sniper: A model equipped with a Sniper rifle improves its BS by +1."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 135
};
