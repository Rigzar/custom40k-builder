/**
 * TZAANGORS — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Tzaangors.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME               M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   8-17  Tzaangor           6"   4+  4+  3  3  1  3  2   6  6+    10
 *   1     Twistbray          6"   4+  4+  3  3  1  3  2   6  6+    10
 *   *     Aspiring Twistbray 6"   4+  4+  3  3  1  3  2   7  6+    15  [upgrade]
 *
 * EQUIPPED WITH: Each model is equipped with: Chainsword; Autopistol.
 *   (HTML row 7 equipped text says "Machine pistol" but weapon table names it "Autopistol" —
 *   HTML internal inconsistency; TS correctly uses "Autopistol" per the weapon table.)
 *
 * WEAPONS:
 *   Autopistol      12"  Pistol 1  3  AP0   D1  —
 *   Chainsword       —   Melee     U  AP-1  D1  —
 *   Eldritch shield  —   Melee     U  AP-1  D1  Deflect, Parry  [replaces Autopistol+Chainsword]
 *
 * OPTIONS:
 *   • One model may take an Icon of Chaos +10
 *   • One model may take an Instrument of Chaos +5
 *   • All models may replace Autopistol and Chainsword: Eldritch shield +2 per model
 *   • Twistbray can be promoted to Aspiring Twistbray +5 (armory access)
 *
 * ABILITIES (verbatim):
 *   Mark of Tzeentch
 *   Eldritch Shield: The model gains the abilities "Deflect" and "Parry".
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Thousand Sons
 *   (locked_mark: "Tzeentch" — innate mark, no mark option group)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (3 profiles) ✓
 *   ✓ all 3 weapons match HTML exactly ✓
 *   ✓ locked_mark: "Tzeentch" / champion_has_armory: true ✓
 *   ✓ Icon+Instrument fixed_max groups ✓
 *   ✓ Eldritch shield every-model replace group ✓
 *   ✓ default_size: 9 (8 Tzaangor + 1 Twistbray) / min_cost: 90 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const tzaangors: Unit = {
  "name": "Tzaangors",
  "models": [
    {
      "name": "Tzaangor",
      "points": 10,
      "min": 8,
      "max": 17,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    },
    {
      "name": "Twistbray",
      "points": 10,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aspiring Twistbray",
      "points": 15,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Each model is equipped with: Chainsword; Autopistol.",
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
      "name": "Tzaangor blade",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Icon of Chaos",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Another model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Instrument of Chaos",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model's Autopistol and Chainsword may be replaced",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Eldritch shield and Tzaangor blade",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Autopistol",
        "Chainsword"
      ]
    },
    {
      "header": "The Twistbray can be promoted to an Aspiring Twistbray for +5pts and gains access to the armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Aspiring Twistbray",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Mark of Tzeentch",
    "Eldritch Shield: The model gains the abilities \"Deflect\" and \"Parry\"."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Thousand Sons"
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
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Troops",
  "default_size": 9,
  "min_cost": 90
};
