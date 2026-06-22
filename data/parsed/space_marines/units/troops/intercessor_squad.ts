/**
 * INTERCESSOR SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Intercessor Squad.html)
 * ─────────────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Intercessor Marine      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 37 pts
 *   1    Intercessor Sergeant    M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 37 pts
 *   *    Veteran Intercessor Sgt M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 47 pts
 * EQUIPPED WITH: Every model: Bolt rifle; Bolt pistol; Frag grenades; Krak grenades.
 * WEAPONS:
 *   Bolt pistol               12" Pistol 1     S:4  AP:-1 D:1  -
 *   Bolt rifle (Bolt ammo)    30" Rapid Fire 1 S:4  AP:-1 D:1  -
 *   Bolt rifle (Stalker ammo) 36" Heavy 1      S:4  AP:-2 D:1  -
 *   Bolt rifle (Assault ammo) 24" Assault 2    S:4  AP:0  D:1  -
 *   Pyroblaster               12" Assault 4    S:4  AP:0  D:1  Flames
 *   Frag grenade               6" Grenade 1    S:4  AP:0  D:1  Explosive
 *   Krak grenade               6" Grenade 1    S:6  AP:-2 D:1  -
 * OPTIONS:
 *   For every 5 models, one Marine may be equipped with: Grenade launcher +1
 *   Alternatively, for every 5 models, one Marine may swap Bolt rifle: Pyroblaster +0
 *   Intercessor Sergeant → Veteran Intercessor Sergeant +10 pts + armory.
 * ABILITIES:
 *   Combat squads, They Shall Know No Fear
 *   Grenade launcher: Grenades carried by the model gain a range of 24".
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. champion_has_armory:true (vet upgrade grants armory).
 */

import type { Unit } from '../../../../../src/types/data';

export const intercessorSquad: Unit = {
  "name": "Intercessor Squad",
  "models": [
    {
      "name": "Intercessor Marine",
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
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Intercessor Sergeant",
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
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Veteran Intercessor Sergeant",
      "points": 47,
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
  "equipped_with": "Every model is equipped with: Bolt rifle; Bolt pistol; Frag grenades; Krak grenades.",
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
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Pyroblaster",
      "range": "12\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
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
      "name": "Bolt rifle (Bolt ammo)",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt rifle (Stalker ammo)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt rifle (Assault ammo)",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, one Intercessor Marine may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Grenade launcher",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Alternatively, for every 5 models, one Intercessor Marine may swap their Bolt rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Pyroblaster",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt rifle (Bolt ammo)", "Bolt rifle (Stalker ammo)", "Bolt rifle (Assault ammo)"]
    },
    {
      "header": "The Intercessor Sergeant may be upgraded to a Veteran Intercessor Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Intercessor Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear",
    "Grenade launcher: Grenades carried by the model gain a range of 24\"."
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
  "min_cost": 185
};
