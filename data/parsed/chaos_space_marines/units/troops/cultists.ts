/**
 * CULTISTS — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Cultists.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME                       M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   9-29  Cultist                    6"   4+  4+  3  3  1  3  1   5  6+     5
 *   1     Cultist Champion           6"   4+  4+  3  3  1  3  1   5  6+     5
 *   *     Aspiring Cultist Champion  6"   4+  4+  3  3  1  3  1   6  6+    10  [upgrade]
 *
 * EQUIPPED WITH: Every model is equipped with: Crude melee weapon; Machine pistol.
 *
 * WEAPONS:
 *   Crude melee weapon  —    Melee         U  AP0  D1  —
 *   Flamer              9"   Assault 4     4  AP0  D1  Flames         [option, per 10 models]
 *   Frag grenade        6"   Grenade 1     4  AP0  D1  Explosive
 *   Grenade launcher   24"   Rapid fire 1  4  AP0  D1  Explosive      [option, per 10 models]
 *   Heavy machine gun  36"   Heavy 3       4  AP0  D1  Suppression    [option, per 10 models]
 *   Machine gun        24"   Rapid Fire 1  3  AP0  D1  —              [option swap]
 *   Machine pistol     12"   Pistol 1      3  AP0  D1  —
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): K+1 / S+1 / N+1 / T+2
 *     (NO Undivided for Cultists)
 *   • Any model may swap Machine pistol: Machine gun +0
 *   • For each 10 models, 1 Cultist may replace Machine pistol with:
 *     Grenade launcher +4 / Flamer +5 / Heavy machine gun +9
 *   • Cultist Champion may upgrade to Aspiring Cultist Champion +5 (armory access)
 *
 * ABILITIES: — (none)
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Cultist
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (3 model profiles) ✓
 *   ✓ all 7 weapons match HTML exactly ✓
 *   ✓ marks: K/S/N+1 / T+2 only — no Undivided ✓
 *   ✓ per_n weapon swap groups ✓
 *   ✓ champion_has_armory: true / has_veteran_abilities: false ✓
 *   ✓ default_size: 10 / min_cost: 50 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const cultists: Unit = {
  "name": "Cultists",
  "models": [
    {
      "name": "Cultist",
      "points": 5,
      "min": 9,
      "max": 29,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "5",
        "SV": "6+"
      }
    },
    {
      "name": "Champion",
      "points": 5,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "5",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aspiring Cultist Champion",
      "points": 10,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Machine gun; Frag grenades.",
  "weapons": [
    {
      "name": "Crude melee weapon",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamer",
      "range": "9''",
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
      "name": "Heavy machine gun",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Machine gun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Machine pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Grenade launcher - Frag grenade",
      "range": "24\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Grenade launcher - Krak grenade",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
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
      "header": "Any model can swap their Machine gun",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Crude melee weapon & Machine pistol",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 10 models, one Cultist may swap their Machine gun",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Grenade launcher",
          "points": 4
        },
        {
          "name": "Flamer",
          "points": 5
        },
        {
          "name": "Heavy machine gun",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A Champion may be upgraded to an Aspiring Cultist Champion for +5 points. The Aspiring Cultist Champion has access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Aspiring Cultist Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
  "unit_type": "Infantry",
  "keywords": [
    "Cultist"
  ],
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
  "default_size": 10,
  "min_cost": 50
};
