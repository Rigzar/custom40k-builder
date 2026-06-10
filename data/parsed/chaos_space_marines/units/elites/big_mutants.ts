/**
 * BIG MUTANTS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Big Mutants.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME         M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   3-10  Big Mutant   6”   3+  5+  6  4  3  3  3   6  5+   26
 *   0-1   Boss Mutant  6”   3+  5+  6  4  3  3  3   7  5+   36
 *   (Boss Mutant is an optional upgrade: +10 pts, gains armory access)
 *
 * EQUIPPED WITH: Every model is equipped with: Big crude melee weapon.
 *
 * WEAPONS:
 *   Big crude melee weapon  —    Melee        U   AP-1  D1  —
 *   Machine gun             24”  Rapid Fire 1  3   AP0   D1  —         [+1 pt/model]
 *   Flamer                   9”  Assault 4     4   AP0   D1  Flames    [+8 pts, max 2]
 *   Heavy machine gun        36” Heavy 3       4   AP0   D1  Suppression [+8 pts, max 2]
 *
 * OPTIONS:
 *   • Entire unit may receive: Bloated +11 pts/model (gains 4+ armor save)
 *   • Any model may be equipped with: Machine gun +1
 *   • Up to two models may be equipped with: Flamer+8 / Heavy machine gun+8
 *   • One Big Mutant may be upgraded to Boss Mutant +10 (armory access)
 *
 * ABILITIES (verbatim):
 *   Bloated: The model gains a 4+ armor save.
 *
 * UNIT TYPE: Monstrous Infantry
 * KEYWORDS: Cultist
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly
 *   ✓ all weapons match HTML exactly
 *   ✓ Bloated: effect stat_mod SV delta:-1 (5+→4+) ✓
 *   ✓ Boss Mutant in variant_models / champion_has_armory: true ✓
 *   ✓ unit_type: “Monstrous Infantry” ✓
 *   ✓ keywords: [“Cultist”] (no “Chaos Space Marine”) ✓
 *   ✓ has_veteran_abilities: false / veteran_max: null ✓
 *   ✓ locked_mark: null (no mark restriction) ✓
 *   ✓ default_size: 3 / min_cost: 78 (3×26 = 78) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const bigMutants: Unit = {
  "name": "Big Mutants",
  "models": [
    {
      "name": "Big Mutant",
      "points": 26,
      "min": 3,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "6",
        "T": "4",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Boss Mutant",
      "points": 36,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "6",
        "T": "4",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Big crude melee weapon.",
  "weapons": [
    {
      "name": "Big crude melee weapon",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Flamer",
      "range": "9''",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heavy machine gun",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "The entire unit may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Bloated",
          "points": 11,
          "effect": { "stat_mod": [{ "stat": "SV", "delta": -1 }] }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any model may be equipped with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Machine gun",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to two models may be equipped with",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 8
        },
        {
          "name": "Heavy machine gun",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A Big Mutant may be upgraded to a Boss Mutant for +10 points. The Boss Mutant has access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Boss Mutant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bloated: The model gains a 4+ armor save."
  ],
  "unit_type": "Monstrous Infantry",
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
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 78
};

