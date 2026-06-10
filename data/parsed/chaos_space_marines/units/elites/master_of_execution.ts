/**
 * MASTER OF EXECUTION — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Master of Execution.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1    Master of Execution   6"   2+  3+  4  4  3  4  2   8  3+   70
 *
 * EQUIPPED WITH: A Master of Execution is equipped with: Axe of dismemberment; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Axe of dismemberment  —  Melee     S+3  AP-3  D2  AT(1), Deadly(5+)
 *   Frag grenade          6"  Grenade 1  S4  AP 0  D1  Explosive
 *   Krak grenade          6"  Grenade 1  S6  AP-2  D1  -
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos:
 *     Undivided +0 / Khorne +6 / Slaanesh +6 / Nurgle +17 / Tzeentch +12
 *   • Has access to weapons and gear from the Armory.
 *   • Can gain up to 2 veteran abilities.
 *
 * ABILITIES (verbatim):
 *   Command squad
 *   Advisor: For every HQ unit, you may select one Master of Execution without using up an Elite slot.
 *   Trophy-taker: The model can re-roll 1 hit roll and 1 wound roll per activation.
 *
 * UNIT TYPE: Infantry  (note: NOT "Character model" — single-model non-character)
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML exactly
 *   ✓ mark options: Undivided+0 / K+6 / S+6 / N+17 / T+12
 *   ✓ advisor: true (Advisor ability = no Elite slot required per HQ unit)
 *   ✓ has_armory_access: true / has_veteran_abilities: true / veteran_max: 2
 *   ✓ is_character: false — HTML unit type is "Infantry" (not "Character model")
 *   ✓ champion_has_armory: false (single model, armory via has_armory_access)
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const masterOfExecution: Unit = {
  "name": "Master of Execution",
  "models": [
    {
      "name": "Master of Execution",
      "points": 70,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Master of Execution is equipped with: Axe of dismemberment; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Axe of dismemberment",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Deadly(5+)"
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "May receive a Mark of Chaos",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Undivided",
          "points": 0
        },
        {
          "name": "Khorne",
          "points": 6
        },
        {
          "name": "Slaanesh",
          "points": 6
        },
        {
          "name": "Nurgle",
          "points": 17
        },
        {
          "name": "Tzeentch",
          "points": 12
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad",
    "Advisor: For every HQ unit, you may select one Master of Execution without using up an Elite slot.",
    "Trophy-taker: The model can re-roll 1 hit roll and 1 wound roll per activation."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": true,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 70
};
