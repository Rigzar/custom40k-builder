/**
 * WARPTALONS — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Warptalons.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-9  Warp Talon            12"  3+  3+  4  4  2  4  2   8  3+   63
 *   1    Warp Talon Champion   12"  3+  3+  4  4  2  4  2   8  3+   68
 *
 * EQUIPPED WITH: Each model is equipped with: Warpclaws; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Frag grenade   6"  Grenade 1  S4  AP 0  D1  Explosive
 *   Krak grenade   6"  Grenade 1  S6  AP-2  D1  -
 *   Warpclaws       -  Melee      SU  AP-3  D1  Flurry(2), Shred, Unwieldy
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
 *     Tzeentch +5pts
 *   • The Warp Talon Champion has access to weapons and gear from the Armory
 *   • May have up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Deep strike, Daemon
 *   Daemonic charge: Enemy units suffer an additional -1 to hit penalty during
 *   Defensive fire.
 *
 * UNIT TYPE: Jump pack infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: mark (per-model)
 *   ✓ champion_has_armory: true (matches "Warp Talon Champion has access to weapons and
 *     gear from the Armory" — full armory, not vehicle-only)
 *   ✓ has_veteran_abilities: true / veteran_max: 2
 *   ✓ unit_type: "Jump Pack Infantry" — title-cased from source's "Jump pack infantry"
 *     (global unit_type casing normalization, ki-jumppack-otherfactions-01 fix, v0.51)
 *   ✓ keywords: ["Chaos Space Marine"] / no armourKeyword
 *   ✓ default_size: 5 (4 Warp Talons + 1 Champion) / min_cost: 320 (4×63 + 68) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const warptalons: Unit = {
  "name": "Warptalons",
  "models": [
    {
      "name": "Warp Talon",
      "points": 63,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "12\"",
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
      "name": "Warp Talon Champion",
      "points": 68,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
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
  "equipped_with": "Each model is equipped with: Warpclaws; Frag grenades; Krak grenades.",
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Warpclaws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(2), Shred, Unwieldy"
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
    }
  ],
  "abilities": [
    "Deep strike, Daemon",
    "Daemonic charge: Enemy units suffer an additional -1 to hit penalty during Defensive fire."
  ],
  "unit_type": "Jump Pack Infantry",
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 320
};
