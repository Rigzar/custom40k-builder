/**
 * RUBRIC MARINES — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Rubric Marines.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME               M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-8   Rubric Marine      6”   3+  3+  4  4  2  4  2   8  3+   41
 *   1     Aspiring Sorcerer  6”   3+  3+  4  4  2  4  2   8  3+   51
 *
 * EQUIPPED WITH: Every Rubric Marine: Inferno bolter.
 *   Aspiring Sorcerer: Inferno bolt pistol; Force staff.
 *
 * WEAPONS:
 *   Inferno bolter       24”  Rapid fire 1  4  AP-2  D1  —
 *   Inferno bolt pistol  12”  Pistol 1      4  AP-2  D1  —
 *   Force staff           —   Melee        +3  AP-1  D1  AT(1), Force weapon
 *   Soulreaper cannon    24”  Heavy 4       6  AP-2  D1  Armor piercing(5+)
 *   Warpflamer            9”  Assault 4     4  AP-1  D1  Flames
 *
 * OPTIONS:
 *   • Each model’s Inferno bolter → Warpflamer +4
 *   • One Rubric Marine’s Inferno bolter → Soulreaper cannon +25
 *   • At 9 models: another Rubric Marine’s Inferno bolter → Soulreaper cannon +25
 *   • Aspiring Sorcerer has armory access; up to 1 veteran ability
 *
 * ABILITIES (verbatim):
 *   Mark of Tzeentch, Unyielding
 *   Psyker: An Aspiring Sorcerer may cast and/or deny 1 psychic power.
 *     He knows smite as well as one psychic power of a chosen discipline.
 *   ENGINE TODO: enforce cast/deny limit and ‘chosen discipline’ mechanic.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Thousand Sons, Psyker
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, all weapons match HTML exactly
 *   ✓ locked_mark: “Tzeentch” ✓
 *   ✓ champion_has_armory: true (Aspiring Sorcerer) ✓
 *   ✓ has_veteran_abilities: true / veteran_max: 1 ✓
 *   ✓ veteran_required: false (HTML: “up to 1 veteran ability” — optional) ✓
 *   ✓ is_psyker: true ✓
 *   ✓ default_size: 5 / min_cost: 215 (4×41 + 1×51 = 215) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const rubricMarines: Unit = {
  "name": "Rubric Marines",
  "models": [
    {
      "name": "Rubric Marine",
      "points": 41,
      "min": 4,
      "max": 8,
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
    },
    {
      "name": "Aspiring Sorcerer",
      "points": 51,
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
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Rubric Marine is equipped with: Inferno bolter. The Aspiring Sorcerer is equipped with: Inferno bolt pistol; Force staff.",
  "weapons": [
    {
      "name": "Inferno bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Inferno bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Force staff",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1), Force weapon"
    },
    {
      "name": "Soulreaper cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Warpflamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "Each model's Inferno bolter may be replaced with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Warpflamer",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Inferno bolter"
      ]
    },
    {
      "header": "One Rubric Marine's Inferno bolter may be replaced with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Soulreaper cannon",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If the unit consists of 9 models, another Rubric Marine's Inferno bolter may be replaced with a Soulreaper cannon.",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Soulreaper cannon",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Mark of Tzeentch, Unyielding",
    "Psyker: An Aspiring Sorcerer may cast and/or deny 1 psychic power. He knows smite as well as one psychic power of a chosen discipline."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Thousand Sons",
    "Psyker"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 215
};

