/**
 * EIGHTBOUND — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Eightbound.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   2-7  Eightbound          6”   3+  3+  6  5  2  4  4   8  3+   52
 *   1    Eightbound Champion 6”   3+  3+  6  5  2  4  4   8  3+   52
 *   (Champion same points as regular model)
 *
 * EQUIPPED WITH: Every model is equipped with: Eviscerating blades.
 *
 * WEAPONS:
 *   Eviscerating blade  —  Melee  U   AP-3  D1  Shred
 *   Heavy chainglaive   —  Melee  +2  AP-2  D2  AT(1), Quick(1), Shred, Unwieldy
 *
 * OPTIONS:
 *   • Eightbound Champion may swap Eviscerating blade → Heavy chainglaive +6
 *   • All models (incl. Champion) may upgrade to Exalted Eightbound +20:
 *     gains +1 W and “Daemon” ability
 *
 * ABILITIES (verbatim):
 *   Berserk(5+), Blind Rage, Massive(1), Mark of Khorne
 *   Exalted Eightbound: The model gains +1 Wound and the “Daemon” ability.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: World Eaters
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (Champion same pts as regular ✓)
 *   ✓ Exalted upgrade: effect stat_mod W+1 + grants_abilities [“Daemon”] ✓
 *   ✓ locked_mark: “Khorne” (from Mark of Khorne ability) ✓
 *   ✓ keywords: [“World Eaters”] ✓
 *   ✓ has_veteran_abilities: true / veteran_max: 1 ✓
 *   ✓ has_armory_access: false / champion_has_armory: false ✓
 *   ✓ default_size: 3 / min_cost: 156 (3×52 = 156) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const eightbound: Unit = {
  "name": "Eightbound",
  "models": [
    {
      "name": "Eightbound",
      "points": 52,
      "min": 2,
      "max": 7,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Eightbound Champion",
      "points": 52,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Eviscerating blades.",
  "weapons": [
    {
      "name": "Eviscerating blade",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Heavy chainglaive",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Quick(1), Shred, Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "The Eightbound Champion may swap their Eviscerating blade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy chainglaive",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Eviscerating blade"]
    },
    {
      "header": "All Eightbound and the Eightbound Champion may be upgraded to Exalted Eightbound",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Exalted Eightbound",
          "points": 20,
          "effect": { "stat_mod": [{ "stat": "W", "delta": 1 }], "grants_abilities": ["Daemon"] }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Berserk(5+), Blind Rage, Massive(1), Mark of Khorne",
    "Exalted Eightbound: The model gains +1 Wound and the \"Daemon\" ability."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "World Eaters"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 156
};

