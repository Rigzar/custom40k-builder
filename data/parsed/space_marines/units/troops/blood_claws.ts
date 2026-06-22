/**
 * BLOOD CLAWS — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Blood Claws.html)
 * ────────────────────────────────────────────────────────
 * PROFILES:
 *   9  Blood Claw            M:6" WS:4+ BS:4+ S:4 T:4 W:2 I:4 A:2 LD:6 SV:3+ — 35 pts
 *   1  Blood Claw Pack Leader M:6" WS:4+ BS:4+ S:4 T:4 W:2 I:4 A:2 LD:6 SV:3+ — 35 pts
 *      (Fixed unit size: exactly 10 models — 9 Blood Claws + 1 Pack Leader.)
 * EQUIPPED WITH: Every model: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.
 * WEAPONS:
 *   Astartes chainsword    -   Melee        S:U  AP:-1 D:1  -
 *   Bolt pistol           12" Pistol 1      S:4  AP:-1 D:1  -
 *   Flamer                 9" Assault 4     S:4  AP:0  D:1  Flames
 *   Melta                 12" Assault 1     S:8  AP:-5 D:1  AT(1), Melta
 *   Plasma gun (Standard) 24" Rapid Fire 1  S:7  AP:-3 D:1  AT(1)
 *   Plasma gun (Overheating) 24" Rapid Fire 1 S:8 AP:-4 D:2 AT(2), Overheating
 *   Plasma pistol (Standard)   12" Pistol 1 S:7  AP:-3 D:1  AT(1)
 *   Plasma pistol (Overcharged) 12" Pistol 1 S:8 AP:-4 D:2  AT(2), Overheating
 *   Frag grenade           6" Grenade 1     S:4  AP:0  D:1  Explosive
 *   Krak grenade           6" Grenade 1     S:6  AP:-2 D:1  -
 * OPTIONS:
 *   All models may gain Jump packs +8 pts/model → +6"M, unit type becomes Jump Pack Infantry,
 *     counts as Fast Attack.
 *   Two Blood Claws may swap their Astartes chainsword: Flamer+3, Melta+9, Plasma gun+13
 *   One Blood Claw may swap their Bolt pistol: Plasma pistol+4
 *   Pack Leader has direct armory access (no veteran upgrade required).
 * ABILITIES: Blind Rage, Furious Charge, They Shall Know No Fear
 * UNIT TYPE: Infantry (Jump Pack Infantry if jump packs taken)
 *
 * ENGINE STATUS: ✓ all data matches HTML. has_armory_access:true (Pack Leader direct access).
 *   set_unit_type "Jump Pack Infantry" + stat_mod M+6 on jump pack option correct.
 */

import type { Unit } from '../../../../../src/types/data';

export const bloodClaws: Unit = {
  "name": "Blood Claws",
  "models": [
    {
      "name": "Blood Claw",
      "points": 35,
      "min": 9,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "3+"
      }
    },
    {
      "name": "Blood Claw Pack Leader",
      "points": 35,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.",
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
      "header": "All models may gain Jump packs for +8 points each. They gain +6\" Movement by doing so and change their unit type to \"Jump pack infantry\". Additionally, they count as \"Fast Attack\" units by doing so.",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Jump pack",
          "points": 8,
          "effect": {
            "stat_mod": [
              {
                "stat": "M",
                "delta": 6
              }
            ],
            "set_unit_type": "Jump Pack Infantry"
          }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Two Blood Claws may swap their Astartes chainsword",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 3
        },
        {
          "name": "Melta",
          "points": 9
        },
        {
          "name": "Plasma gun",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Astartes chainsword"]
    },
    {
      "header": "One Blood Claw may swap their Bolt pistol",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Plasma pistol",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt pistol"]
    }
  ],
  "abilities": [
    "Blind Rage, Furious Charge, They Shall Know No Fear"
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
  "default_size": 10,
  "min_cost": 350
};
