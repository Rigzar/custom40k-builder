/**
 * TZAANGOR ENLIGHTENED — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Tzaangor Enlightened.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   2-8  Tzaangor Enlightened  12"  3+  3+  4  4  2  4  3   8  5+   27
 *   1    Aviarch               12"  3+  3+  4  4  2  4  3   8  5+   27
 *
 * EQUIPPED WITH: Every model is equipped with: Autopistol; Chainsword.
 *
 * WEAPONS:
 *   Autopistol            12"  Pistol 1   S3   AP 0  D1  -
 *   Chainsword             -   Melee      SU   AP-1  D1  -
 *   Divining spear         -   Melee      S+1  AP-2  D1  Quick(+1)
 *   Fatecaster greatbow   24"  Assault 1  S+1  AP-2  D2  Armor piercing(5+), Suppression
 *
 * OPTIONS:
 *   • Each model may swap their Autopistol AND Chainsword for:
 *     Divining spear +2 / Fatecaster greatbow +15
 *
 * ABILITIES (verbatim):
 *   Mark of Tzeentch
 *   Sniper: Models equipped with a Fatecaster greatbow get a +1 bonus to their BS.
 *
 * UNIT TYPE: Jetbike
 * KEYWORDS: Thousand Sons
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "every" (each model swaps both Autopistol+Chainsword for one of two
 *     melee/ranged alternatives — combo-replace modeled as a flat choice list, no `replaces`
 *     array since both source weapons drop together for either pick)
 *   ✓ locked_mark: "Tzeentch" (from "Mark of Tzeentch" ability — locked, no mark choice offered)
 *   ✓ unit_type: "Jetbike" / keywords: ["Thousand Sons"]
 *   ✓ no armourKeyword / no champion/veteran lines in text
 *   ✓ default_size: 3 (2 Enlightened + 1 Aviarch) / min_cost: 81 (2×27 + 27) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const tzaangorEnlightened: Unit = {
  "name": "Tzaangor Enlightened",
  "models": [
    {
      "name": "Tzaangor Enlightened",
      "points": 27,
      "min": 2,
      "max": 8,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "5+"
      }
    },
    {
      "name": "Aviarch",
      "points": 27,
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
        "A": "3",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Autopistol; Chainsword.",
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
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Divining spear",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Fatecaster greatbow",
      "range": "24\"",
      "type": "Assault 1",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Autopistol and Chainsword",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Divining spear",
          "points": 2
        },
        {
          "name": "Fatecaster greatbow",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Autopistol", "Chainsword"]
    }
  ],
  "abilities": [
    "Mark of Tzeentch",
    "Sniper: Models equipped with a Fatecaster greatbow get a +1 bonus to their BS."
  ],
  "unit_type": "Jetbike",
  "keywords": [
    "Thousand Sons"
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
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 81
};
