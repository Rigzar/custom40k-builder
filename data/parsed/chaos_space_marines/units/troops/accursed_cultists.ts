/**
 * ACCURSED CULTISTS — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Accursed Cultists.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.    NAME              M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   10-15  Accursed Cultist  6"   4+  4+  4  3  1  3  1   6  6+     6
 *   1-3    Torment           6"   4+  4+  5  4  3  4  2   6  6+    16  [1 per 5 Accursed Cultist]
 *
 * EQUIPPED WITH: Every Accursed Cultist is equipped with: Vile mutation.
 *   Every Torment is equipped with: Daemonic mutation.
 *
 * WEAPONS:
 *   Vile mutation     —  Melee  U  AP-1  D1  —   [Accursed Cultist]
 *   Daemonic mutation —  Melee  U  AP-2  D1  —   [Torment]
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): K+1 / S+1 / N+1 / T+2
 *     (NO Undivided)
 *   • Per 5 Accursed Cultist models you may set up 1 Torment (HTML No. 1-3: min 1, max 3)
 *
 * ABILITIES (verbatim):
 *   Unpredictable mutations: At the start of each battle round, before any unit activates,
 *     roll a D6 for each unit of Accursed Cultists. On a 4+, the controlling player may select
 *     one of the following until the end of the battle round: +1 Strength, +1 Toughness, or +1
 *     to invulnerable saves (to a minimum of 4+).
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Cultist
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (Accursed S4/T3 + Torment S5/T4 W3) ✓
 *   ✓ both weapons match HTML exactly ✓
 *   ✓ marks: K/S/N+1 / T+2 only — no Undivided ✓
 *   ✓ Torment as separate model_type (min 1, max 3) per per_5 rule ✓
 *   ✓ default_size: 11 / min_cost: 76 (10×6 + 1×16) ✓
 *   ✓ has_veteran_abilities: false / no champion ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const accursedCultists: Unit = {
  "name": "Accursed Cultists",
  "models": [
    {
      "name": "Accursed Cultist",
      "points": 6,
      "min": 10,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Torment",
      "points": 16,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Accursed Cultist is equipped with: Vile mutation. Every Torment is equipped with: Daemonic mutation.",
  "weapons": [
    {
      "name": "Vile mutation",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Daemonic mutation",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a mark of chaos (points per model)",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 1
        },
        {
          "name": "Slaanesh",
          "points": 1
        },
        {
          "name": "Nurgle",
          "points": 1
        },
        {
          "name": "Tzeentch",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Per 5 Accursed Cultist models you may set up 1 Torment.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Unpredictable mutations: Models with this ability cannot use transport vehicles. At the start of each activation, this unit may return 1D3 dead models to the game."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Cultist"
  ],
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
  "default_size": 11,
  "min_cost": 76
};
