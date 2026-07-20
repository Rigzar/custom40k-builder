/**
 * INDOMITUS CRUSADER SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Indomitus Crusader Squad.html)
 * ─────────────────────────────────────────────────────────────────────
 * PROFILES:
 *   0-10  Neophyte      M:6" WS:4+ BS:4+ S:4 T:4 W:1 I:4 A:2 LD:6 SV:4+ — 15 pts
 *   4-9   Initiate      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 35 pts
 *   1     Sword Brother M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 36 pts
 * EQUIPPED WITH:
 *   Every Neophyte:    Astartes chainsword; Frag grenades; Bolt pistol; Krak grenades.
 *   Every Initiate:    Astartes chainsword; Frag grenades; Heavy bolt pistol; Krak grenades.
 *   Sword Brother:     Frag grenades; Krak grenades.
 * WEAPONS:
 *   Astartes shotgun  18" Assault 2    S:4  AP:0  D:1  -
 *   Bolt carbine      24" Rapid Fire 1 S:4  AP:-1 D:1  -   (no Seeking ability — different from Infiltrators)
 *   Bolt pistol       12" Pistol 1     S:4  AP:-1 D:1  -
 *   Bolt rifle (Bolt ammo)    30" Rapid Fire 1 S:4 AP:-1 D:1  -
 *   Bolt rifle (Stalker ammo) 36" Heavy 1      S:4 AP:-2 D:1  -
 *   Bolt rifle (Assault ammo) 24" Assault 2    S:4 AP:0  D:1  -
 *   Heavy bolt pistol  12" Pistol 1    S:4  AP:-2 D:1  -
 *   Pyroblaster        12" Assault 4   S:4  AP:0  D:1  Flames
 *   Pyro pistol         9" Pistol 4    S:4  AP:0  D:1  Flames
 *   Frag grenade        6" Grenade 1   S:4  AP:0  D:1  Explosive
 *   Krak grenade        6" Grenade 1   S:6  AP:-2 D:1  -
 * OPTIONS:
 *   All Neophytes may swap Astartes chainsword: Astartes shotgun+1, Bolt carbine+1
 *   Each Initiate may swap Astartes chainsword: Bolt rifle+2
 *   Per-10 models, two Initiates swap Astartes chainsword: Pyroblaster+1, Power fist+11
 *   Per-10 models, two Initiates swap Heavy bolt pistols: Pyro pistol+2, Plasma pistol+7
 *   Sword Brother has access to weapons and gear from the Armory.
 * ABILITIES: Combat squads, They Shall Know No Fear; Squires (Neophytes removed first as
 *   casualties, use own defensive profile even if not the majority) — added SM 1.01.
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: equipped_with field only stores Neophyte line (string limitation); Initiate/Sword
 *   Brother gear deduced from option groups. has_armory_access:true (Sword Brother direct access).
 *   BUGS FIXED: Neophyte Astartes shotgun 0→1 pt, Bolt carbine 0→1 pt, Pyroblaster 0→1 pt.
 */

import type { Unit } from '../../../../../src/types/data';

export const indomitusCrusaderSquad: Unit = {
  "name": "Indomitus Crusader Squad",
  "models": [
    {
      "name": "Neophyte",
      "points": 15,
      "min": 0,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Initiate",
      "points": 35,
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
      "name": "Sword Brother",
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
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Neophyte: Astartes chainsword; Frag grenades; Bolt pistol; Krak grenades. Every Initiate: Astartes chainsword; Frag grenades; Heavy bolt pistol; Krak grenades. Sword Brother: Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Bolt carbine",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
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
      "name": "Pyro pistol",
      "range": "9\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heavy bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
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
    }
  ],
  "option_groups": [
    {
      "header": "All Neophytes may swap their Astartes chainsword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Astartes shotgun",
          "points": 1
        },
        {
          "name": "Bolt carbine",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Astartes chainsword"]
    },
    {
      "header": "Each Initiate may swap their Astartes chainsword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Bolt rifle",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Astartes chainsword"]
    },
    {
      "header": "For every 10 models, two Initiates may swap their Astartes chainsword",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Pyroblaster",
          "points": 1
        },
        {
          "name": "Power fist",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Astartes chainsword"]
    },
    {
      "header": "For every 10 models, two Initiates may swap their Heavy bolt pistols",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Pyro pistol",
          "points": 2
        },
        {
          "name": "Plasma pistol",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy bolt pistol"]
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear",
    "Squires: Neophytes may always be removed first as casualties and use their own defensive profile, even if they are not the majority in the unit."
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 176
};
