/**
 * OBLITERATOR — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Obliterator.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME         M   WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1-3   Obliterator  6"  3+  3+  5  5  3  4  3   8  2+  141
 *
 * EQUIPPED WITH: An Oblierator [sic] is equipped with: An array of Fleshmetal guns; Power fist.
 *
 * WEAPONS:
 *   Assault cannon                24"  Heavy 4       S6  AP-2  D1  Armor piercing(5+)
 *   Heavy flamer                   9"  Assault 4     S5  AP-1  D1  Flames
 *   Lascannon                     48"  Heavy 1       S9  AP-4  D3  AT(3)
 *   Multi-melta                   24"  Assault 1     S8  AP-5  D2  AT(2), Melta
 *   Plasma cannon - Standard      36"  Heavy 1       S7  AP-3  D1  AT(1), Explosive
 *   Plasma cannon - Overcharged   36"  Heavy 1       S8  AP-4  D2  AT(2), Explosive, Overheating
 *   Power fist                     -   Melee         Sx2 AP-3  D2  AT(2), Slow(-2)
 *   Twin flamer                    9"  Assault 8     S4  AP 0  D1  Flames
 *   Twin melta                    12"  Assault 2     S8  AP-5  D1  AT(1), Melta
 *   Twin plasma gun - Standard    24"  Rapid Fire 2  S7  AP-3  D1  AT(1)
 *   Twin plasma gun - Overheating 24"  Rapid Fire 2  S8  AP-4  D2  AT(2), Overheating
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +4pts,
 *     Tzeentch +10pts
 *   • May have up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Deepstrike, Daemon, Unyielding
 *   Fleshmetal guns: The model may not use the same ranged weapon in two consecutive
 *   battle rounds.
 *
 * UNIT TYPE: Monstrous Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (Plasma cannon /
 *     Twin plasma gun sub-profiles correctly split into separate "<weapon> - <profile>"
 *     entries; full multi-profile "array of Fleshmetal guns" weapon roster preserved —
 *     no swap option_groups in source, the unit simply HAS access to all these profiles
 *     per "Fleshmetal guns" ability text)
 *   ✓ option_groups: mark (per-model, Khorne/Slaanesh/Nurgle +4 vs Tzeentch +10 — an
 *     uneven tiered-pricing mark group, distinct from the uniform +10/god seen on
 *     single-model vehicles)
 *   ✓ has_veteran_abilities: true / veteran_max: 2
 *   ✓ has_armory_access: false / champion_has_armory: false (no armory line in text)
 *   ✓ unit_type: "Monstrous Infantry" / keywords: ["Chaos Space Marine"] (no "Vehicle"
 *     append — Monstrous Infantry, not a Vehicle, consistent with the convention)
 *   ✓ default_size: 1 (min "1-3") / min_cost: 141
 *   🟡 "An Oblierator is equipped with..." — source has a typo ("Oblierator" for
 *     "Obliterator"); prod JSON copies it verbatim in `equipped_with` (matches canonical
 *     text exactly per FAQ#5 — cosmetic, not a data bug)
 */

import type { Unit } from '../../../../../src/types/data';

export const obliterator: Unit = {
  "name": "Obliterator",
  "models": [
    {
      "name": "Obliterator",
      "points": 141,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Oblierator is equipped with: An array of Fleshmetal guns; Power fist.",
  "weapons": [
    {
      "name": "Assault cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Power fist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Twin flamer",
      "range": "9\"",
      "type": "Assault 8",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Twin melta",
      "range": "12\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Plasma cannon - Standard",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma cannon - Overcharged",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    },
    {
      "name": "Twin plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin plasma gun - Overheating",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
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
          "points": 4
        },
        {
          "name": "Slaanesh",
          "points": 4
        },
        {
          "name": "Nurgle",
          "points": 4
        },
        {
          "name": "Tzeentch",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deepstrike, Daemon, Unyielding",
    "Fleshmetal guns: The model may not use the same ranged weapon in two consecutive battle rounds."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 141
};
