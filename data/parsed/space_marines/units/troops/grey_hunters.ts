/**
 * GREY HUNTERS — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Grey Hunters.html)
 * ─────────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Grey Hunter            M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 40 pts
 *   1    Grey Hunter Pack Leader M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 40 pts
 *   *    Wolf Guard Pack Leader  M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 50 pts
 * EQUIPPED WITH: Every model: Astartes Chainsword; Boltgun; Bolt pistol; Frag grenades; Krak grenades.
 * WEAPONS:
 *   Astartes chainsword      -   Melee        S:U  AP:-1 D:1  -
 *   Bolt pistol             12" Pistol 1      S:4  AP:-1 D:1  -
 *   Boltgun                 24" Rapid Fire 1  S:4  AP:-1 D:1  -
 *   Flamer                   9" Assault 4     S:4  AP:0  D:1  Flames
 *   Melta                   12" Assault 1     S:8  AP:-5 D:1  AT(1), Melta
 *   Plasma gun (Standard)   24" Rapid Fire 1  S:7  AP:-3 D:1  AT(1)
 *   Plasma gun (Overheating) 24" Rapid Fire 1 S:8  AP:-4 D:2  AT(2), Overheating
 *   Plasma pistol (Standard)    12" Pistol 1  S:7  AP:-3 D:1  AT(1)
 *   Plasma pistol (Overcharged) 12" Pistol 1  S:8  AP:-4 D:2  AT(2), Overheating
 *   Frag grenade             6" Grenade 1     S:4  AP:0  D:1  Explosive
 *   Krak grenade             6" Grenade 1     S:6  AP:-2 D:1  -
 * OPTIONS:
 *   For every 5 models, two Grey Hunters may swap their Boltgun:
 *     Flamer+0, Melta+12, Plasma gun+17
 *   One Grey Hunter may swap their Bolt pistol: Plasma pistol+8
 *   Grey Hunter Pack Leader → Wolf Guard Pack Leader +10 pts + armory.
 * ABILITIES: Combat squads, They Shall Know No Fear
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. champion_has_armory:true (Wolf Guard upgrade grants armory).
 */

import type { Unit } from '../../../../../src/types/data';

export const greyHunters: Unit = {
  "name": "Grey Hunters",
  "models": [
    {
      "name": "Grey Hunter",
      "points": 40,
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
      "name": "Grey Hunter Pack Leader",
      "points": 40,
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
      "name": "Wolf Guard Pack Leader",
      "points": 50,
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
  "equipped_with": "Every model is equipped with: Astartes Chainsword; Boltgun; Bolt pistol; Frag grenades; Krak grenades.",
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
      "name": "Plasma pistol (Standard)",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma pistol (Overcharged)",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
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
      "header": "For every 5 models, two Grey Hunters may swap their Boltgun",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 0
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
      "header": "One Grey Hunter may swap their Bolt pistol",
      "constraint": {
        "type": "one"
      },
      "choices": [
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
      "header": "The Grey Hunter Pack Leader may be upgraded to a Wolf Guard Pack Leader for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Wolf Guard Pack Leader",
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
  "min_cost": 200
};
