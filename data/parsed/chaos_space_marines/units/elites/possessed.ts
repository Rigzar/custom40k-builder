/**
 * POSSESSED — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Possessed.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME       M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   5-10  Possessed  8"   3+  3+  5  5  2  4  3   8  3+   50
 *
 * EQUIPPED WITH: Each model is equipped with: Malefic mutations
 *
 * WEAPONS:
 *   Malefic mutations  —  Melee  SU  AP-3  D1  Armor piercing(5+)
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (points per model):
 *     Nurgle +3 / Tzeentch +9
 *     (NOTE: ONLY Nurgle and Tzeentch available — no Undivided, no Khorne, no Slaanesh)
 *   • All models may be equipped with Jump packs for +11 points per model.
 *   • May have up to 2 veteran abilities.
 *
 * ABILITIES (verbatim): Daemon
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapon match HTML exactly
 *   ✓ mark options: Nurgle+3 / Tzeentch+9 ONLY — correctly restricts mark choices
 *   ✓ locked_mark: null (has mark selector, but restricted to Nurgle/Tzeentch)
 *   ✓ jump packs: adds_unit_types ["Jump Pack Infantry"] + grants_abilities ["Deep Strike"]
 *     per Core Rules lines 503-507 ("Jump Pack Infantry acts like Infantry, gains Deep Strike")
 *   ✓ champion_has_armory: false / has_armory_access: false (no armory mentioned in HTML)
 *   ✓ has_veteran_abilities: true / veteran_max: 2
 *   ✓ default_size: 5 / min_cost: 250 (5×50 = 250) ✓
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const possessed: Unit = {
  "name": "Possessed",
  "models": [
    {
      "name": "Possessed",
      "points": 50,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "8\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Malefic mutations",
  "weapons": [
    {
      "name": "Malefic mutations",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+)"
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
          "name": "Nurgle",
          "points": 3
        },
        {
          "name": "Tzeentch",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All model may be equipped with Jump packs for +11 points per model.",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Jump packs",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "effect": {
        "adds_unit_types": ["Jump Pack Infantry"],
        "grants_abilities": ["Deep Strike"]
      }
    }
  ],
  "abilities": [
    "Daemon"
  ],
  "unit_type": "Infantry",
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 250
};
