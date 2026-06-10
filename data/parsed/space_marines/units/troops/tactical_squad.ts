/**
 * TACTICAL SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Tactical Squad.html)
 * ──────────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Tactical Marine       M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 36 pts
 *   1    Tactical Sergeant     M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 36 pts
 *   *    Veteran Tactical Sgt  M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 46 pts
 * EQUIPPED WITH: Every model: Boltgun; Bolt pistol; Frag grenades; Krak grenades.
 * WEAPONS:
 *   Bolt pistol                 12" Pistol 1      S:4  AP:-1 D:1  -
 *   Boltgun                     24" Rapid Fire 1  S:4  AP:-1 D:1  -
 *   Flamer                       9" Assault 4     S:4  AP:0  D:1  Flames
 *   Grav gun                    24" Rapid Fire 1  S:5  AP:-3 D:1  Grav
 *   Grav cannon                 30" Assault 1     S:5  AP:-3 D:1  Explosive, Grav
 *   Heavy bolter                36" Rapid Fire 2  S:5  AP:-2 D:1  -
 *   Heavy flamer                 9" Assault 4     S:5  AP:-1 D:1  Flames
 *   Lascannon                   48" Heavy 1       S:9  AP:-4 D:3  AT(2)
 *   Melta                       12" Assault 1     S:8  AP:-5 D:1  AT(1), Melta
 *   Multi-melta                 24" Assault 1     S:8  AP:-5 D:2  AT(2), Melta
 *   Missile launcher (Frag)     48" Heavy 1       S:4  AP:0  D:1  Explosive
 *   Missile launcher (Krak)     48" Heavy 1       S:8  AP:-3 D:2  AT(2), Anti-air
 *   Plasma gun (Standard)       24" Rapid Fire 1  S:7  AP:-3 D:1  AT(1)
 *   Plasma gun (Overheating)    24" Rapid Fire 1  S:8  AP:-4 D:2  AT(2), Overheating
 *   Plasma cannon (Standard)    36" Heavy 1       S:7  AP:-3 D:1  AT(1), Explosive
 *   Plasma cannon (Overheating) 36" Heavy 1       S:8  AP:-4 D:2  AT(2), Explosive, Overheating
 *   Frag grenade                 6" Grenade 1     S:4  AP:0  D:1  Explosive
 *   Krak grenade                 6" Grenade 1     S:6  AP:-2 D:1  -
 * OPTIONS:
 *   For every 5 models, one Tactical Marine may swap their Boltgun:
 *     Flamer+0, Grav gun+3, Melta+12, Plasma gun+17
 *   For every 5 models, one Tactical Marine may swap their Boltgun (heavy):
 *     Heavy flamer+8, Heavy bolter+13, Grav cannon+20, Multi-melta+31,
 *     Missile launcher+35, Lascannon+64, Plasma cannon+93
 *   Tactical Sergeant → Veteran Tactical Sergeant +10 pts + armory.
 * ABILITIES: Combat squads, They Shall Know No Fear
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. champion_has_armory:true (vet upgrade grants armory).
 */

import type { Unit } from '../../../../../src/types/data';

export const tacticalSquad: Unit = {
  "name": "Tactical Squad",
  "models": [
    {
      "name": "Tactical Marine",
      "points": 36,
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
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Tactical Sergeant",
      "points": 36,
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
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Tactical Sergeant",
      "points": 46,
      "min": 0,
      "max": 0,
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
  "equipped_with": "Every model is equipped with: Boltgun; Bolt pistol; Frag grenades; Krak grenades.",
  "weapons": [
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
      "name": "Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Grav cannon",
      "range": "30\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Explosive, Grav"
    },
    {
      "name": "Grav gun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Grav"
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
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
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
      "name": "Plasma cannon (Standard)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma cannon (Overheating)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    },
    {
      "name": "Plasma gun (Standard)",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun (Overheating)",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, one Tactical Marine may swap their Boltgun",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 0
        },
        {
          "name": "Grav gun",
          "points": 3
        },
        {
          "name": "Melta",
          "points": 12
        },
        {
          "name": "Plasma gun",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 models, one Tactical Marine may swap their Boltgun",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 8
        },
        {
          "name": "Heavy bolter",
          "points": 13
        },
        {
          "name": "Grav cannon",
          "points": 20
        },
        {
          "name": "Multi-melta",
          "points": 31
        },
        {
          "name": "Missile launcher",
          "points": 35
        },
        {
          "name": "Lascannon",
          "points": 64
        },
        {
          "name": "Plasma cannon",
          "points": 93
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Tactical Sergeant may be upgraded to a Veteran Tactical Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Tactical Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 180
};
