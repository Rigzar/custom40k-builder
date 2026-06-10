/**
 * CHAOS SPAWN — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Spawn.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME         M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1-4  Chaos Spawn  12"  4+   -  5  5  3  3  3  10  6+   22
 *
 * EQUIPPED WITH: Every model is equipped with: Warped mutations.
 *
 * WEAPONS:
 *   Warped mutations    -    Melee   SU   AP-2  D1  -
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
 *     Tzeentch +6pts
 *   • Each model may be upgraded with one of: Grasping Pseudopods +2 / Toxic Haemorrhage +5 /
 *     Subcutaneous Armor +16
 *
 * ABILITIES (verbatim):
 *   Move through cover, Terrifying(-1)
 *   Grasping Pseudopods: The model gains +3 Attacks.
 *   Toxic Haemorrhage: The model gains the "Poison(3+)" ability for all melee attacks.
 *   Subcutaneous Armor: The model gains a 5+ armor save.
 *
 * UNIT TYPE: Monstrous Infantry
 * KEYWORDS: Cultist
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapon, options, abilities all match HTML verbatim
 *   ✓ option_groups: mark / "every" (each model picks one mutation upgrade)
 *   🟡 is_monster: false despite unit_type "Monstrous Infantry" — consistent with the
 *     codebase convention that `is_monster` flags "Monstrous Creature" specifically
 *     (core_rules: Monstrous Infantry "Acts like Infantry" with exceptions, Monstrous
 *     Creature is its own type — see Helbrute/Big Mutants which are also Monstrous
 *     Infantry with is_monster:false). NOT a bug — same pattern faction-wide.
 *   ✓ no armourKeyword / no veteran abilities (text confirms no armory/veteran lines)
 *   ✓ default_size: 1 / min_cost: 22
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosSpawn: Unit = {
  "name": "Chaos Spawn",
  "models": [
    {
      "name": "Chaos Spawn",
      "points": 22,
      "min": 1,
      "max": 4,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "-",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "10",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Warped mutations.",
  "weapons": [
    {
      "name": "Warped mutations",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may be upgraded with one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Grasping Pseudopods",
          "points": 2
        },
        {
          "name": "Toxic Haemorrhage",
          "points": 5
        },
        {
          "name": "Subcutaneous Armor",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Move through cover, Terrifying(-1)",
    "Grasping Pseudopods: The model gains +3 Attacks.",
    "Toxic Haemorrhage: The model gains the \"Poison(3+)\" ability for all melee attacks.",
    "Subcutaneous Armor: The model gains a 5+ armor save."
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
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 22
};
