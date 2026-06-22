/**
 * JAKHALS — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Jakhals.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME                      M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   7-11  Jakhal                    6”   4+  4+  3  3  1  3  2   5  6+     7
 *   1     Jakhal Pack Leader        6”   4+  4+  3  3  1  3  2   5  6+     7
 *   *     Aspiring Jakhal Champion  6”   4+  4+  3  3  1  3  2   6  6+    12  [upgrade]
 *   0-4   Dishonored                6”   4+  4+  4  3  1  3  2   5  6+     7  [S4!]
 *
 * EQUIPPED WITH: Every Jakhal and Jakhal Pack Leader is equipped with: Autopistol; Chainblades.
 *   Every Dishonored is equipped with: Chainblades.
 *
 * WEAPONS:
 *   Autopistol       12”  Pistol 1  3  AP0   D1  —
 *   Chainblade        —   Melee     U  AP-1  D1  —
 *   Mauler chainblade —   Melee    +1  AP-1  D1  —       [option, per 8 Jakhal]
 *   Skullsmasher      —   Melee    +2  AP-1  D1  —       [option, per 8 Dishonored ×2]
 *
 * OPTIONS:
 *   • For every 8 models in the unit, one Jakhal may swap Chainblade: Mauler chainblade +1
 *   • For every 8 models in the unit, two Dishonored may swap Chainblades: Skullsmasher +2
 *   • Pack Leader can be promoted to Aspiring Jakhal Champion +5 (armory access)
 *
 * ABILITIES (verbatim):
 *   Berserk(5+), Mark of Khorne
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: World Eaters
 *   (locked_mark: “Khorne” — innate mark, no mark option group)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (3 model types + Dishonored sub-type) ✓
 *   ✓ all 4 weapons match HTML exactly ✓
 *   ✓ per_n swap groups with applies_to_model filter ✓
 *   ✓ locked_mark: “Khorne” / champion_has_armory: true ✓
 *   ✓ default_size: 8 (7 Jakhal + 1 Pack Leader) / min_cost: 56 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const jakhals: Unit = {
  "name": "Jakhals",
  "models": [
    {
      "name": "Jakhal",
      "points": 7,
      "min": 7,
      "max": 11,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "6+"
      }
    },
    {
      "name": "Jakhal Pack Leader",
      "points": 7,
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
        "A": "2",
        "LD": "5",
        "SV": "6+"
      }
    },
    {
      "name": "Dishonored",
      "points": 7,
      "min": 0,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aspiring Jakhal Champion",
      "points": 12,
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
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every Jakhal and Jakhal Pack Leader is equipped with: Autopistol; Chainblades. Every Dishonored is equipped with: Chainblades.",
  "weapons": [
    {
      "name": "Autopistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Chainblade",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Mauler chainblade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Skullsmasher",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 8 models in the unit, one Jakhal may swap their Chainblade",
      "constraint": {
        "type": "per_n",
        "per_n": 8,
        "count_per_n": 1
      },
      "applies_to_model": "Jakhal",
      "choices": [
        {
          "name": "Mauler chainblade",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Chainblade"]
    },
    {
      "header": "For every 8 models in the unit, two Dishonored may swap their Chainblades",
      "constraint": {
        "type": "per_n",
        "per_n": 8,
        "count_per_n": 2
      },
      "applies_to_model": "Dishonored",
      "choices": [
        {
          "name": "Skullsmasher",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Chainblade"]
    },
    {
      "header": "The Jakhal Pack Leader can be promoted to an Aspiring Jakhal Champion for +5pts and gains access to the armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Aspiring Jakhal Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Berserk(5+), Mark of Khorne"
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
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Troops",
  "default_size": 8,
  "min_cost": 56
};

