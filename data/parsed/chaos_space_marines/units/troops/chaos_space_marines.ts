/**
 * CHAOS SPACE MARINES — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Space Marines.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME                          M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   4-19  Chaos Space Marine            6”   3+  3+  4  4  2  4  2   7  3+    37
 *   1     Chaos Space Marine Champion   6”   3+  3+  4  4  2  4  2   7  3+    37
 *   *     Aspiring Champion             6”   3+  3+  4  4  2  4  2   8  3+    47  [upgrade]
 *
 * EQUIPPED WITH: Every model is equipped with: Astartes Chainsword; Bolter; Bolt pistol;
 *   Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Astartes Chainsword          —    Melee         U  AP-1  D1  —
 *   Autocannon                  48”   Heavy 2       7  AP-2  D1  AT(1)
 *   Bolt pistol                 12”   Pistol 1      4  AP-1  D1  —
 *   Bolter                      24”   Rapid fire 1  4  AP-1  D1  —
 *   Flamer                       9”   Assault 4     4  AP0   D1  Flames
 *   Frag grenade                 6”   Grenade 1     4  AP0   D1  Explosive
 *   Heavy bolter                36”   Rapid Fire 2  5  AP-2  D1  —
 *   Heavy chainaxe               —    Melee        +3  AP-3  D2  AT(1), Deadly(5+), Slow(-1), Unwieldy
 *   Krak grenade                 6”   Grenade 1     6  AP-2  D1  —
 *   Lascannon                   48”   Heavy 1       9  AP-4  D3  AT(3)
 *   Missile launcher - Frag     48”   Heavy 1       4  AP0   D1  Explosive
 *   Missile launcher - Krak     48”   Heavy 1       8  AP-3  D2  AT(2), Anti-Air
 *   Meltagun                    12”   Assault 1     8  AP-5  D1  AT(1), Melta
 *   Plasma gun - Standard       24”   Rapid fire 1  7  AP-3  D1  AT(1)
 *   Plasma gun - Overcharged    24”   Rapid fire 1  8  AP-4  D2  AT(2), Overheat
 *   Reaper chaincannon          24”   Assault 4     5  AP-1  D-1 Suppression
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): K+2 / S+2 / N+2 / T+5
 *     (NO Undivided for Troops, only 4 marks)
 *   • For each 5 models, 1 CSM may swap Bolter: Flamer+0 / Heavy bolter+13 / Meltagun+13 /
 *     Plasma gun+17 / Reaper chaincannon+19 / Autocannon+21 / Missile launcher+35 / Lascannon+64
 *     (HTML typo row 41: “Missle launcher” — TS correctly uses “Missile launcher”)
 *   • For each 5 models, 1 other CSM may swap Chainsword+Bolter+Bolt pistol: Heavy chainaxe +4
 *   • Champion may upgrade to Aspiring Champion +10 (armory access)
 *   • Up to 2 veteran abilities
 *
 * ABILITIES: — (none)
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (3 model profiles) ✓
 *   ✓ all 16 weapons match HTML exactly ✓
 *   ✓ marks: K/S/N/T only — no Undivided (correct for Troops) ✓
 *   ✓ per_n weapon swap groups ✓
 *   ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 2 ✓
 *   ✓ default_size: 5 / min_cost: 185 (5 × 37) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosSpaceMarines: Unit = {
  "name": "Chaos Space Marines",
  "models": [
    {
      "name": "Chaos Space Marine",
      "points": 37,
      "min": 4,
      "max": 19,
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
      "name": "Chaos Space Marine Champion",
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
      "name": "Aspiring Champion",
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
  "equipped_with": "Every model is equipped with: Astartes Chainsword; Bolter; Bolt pistol; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
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
      "name": "Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy chainaxe",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Deadly(5+), Slow(-1), Unwieldy"
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
      "abilities": "AT(3)"
    },
    {
      "name": "Missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-Air"
    },
    {
      "name": "Plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun - Overcharged",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    },
    {
      "name": "Meltagun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Reaper chaincannon",
      "range": "24\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "-1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a Mark of Chaos (points per model)",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 2
        },
        {
          "name": "Slaanesh",
          "points": 2
        },
        {
          "name": "Nurgle",
          "points": 2
        },
        {
          "name": "Tzeentch",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each 5 models, one Chaos Space Marine may swap their Bolter",
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
          "name": "Heavy bolter",
          "points": 13
        },
        {
          "name": "Meltagun",
          "points": 13
        },
        {
          "name": "Plasma gun",
          "points": 17
        },
        {
          "name": "Reaper chaincannon",
          "points": 19
        },
        {
          "name": "Autocannon",
          "points": 21
        },
        {
          "name": "Missile launcher",
          "points": 35
        },
        {
          "name": "Lascannon",
          "points": 64
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolter"]
    },
    {
      "header": "For each 5 models, one other Chaos Space Marine may swap their Astartes Chainsword, Bolter and Bolt pistol",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Heavy chainaxe",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Astartes Chainsword", "Bolter", "Bolt pistol"]
    },
    {
      "header": "The Chaos Space Marine Champion may be upgraded to an Aspiring Chaos Space Marine Champion for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Aspiring Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
  "unit_type": "Infantry",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 185
};

