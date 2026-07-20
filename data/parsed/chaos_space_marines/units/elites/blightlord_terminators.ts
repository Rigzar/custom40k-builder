/**
 * BLIGHTLORD TERMINATORS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Blightlord Terminators.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME                  M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-13  Terminator            6"   3+  3+  4  6  3  4  3   8  2+  109
 *   1     Terminator Champion   6"   3+  3+  4  6  3  4  3   8  2+  114
 *
 * EQUIPPED WITH: Every model is equipped with: Balesword; Combi-bolter.
 *
 * OPTIONS:
 *   • Every Terminator may swap their Combi-bolter (points per model):
 *     - Combi-flamer +0 / Combi-melta +6 / Combi-plasma +10
 *   • Every Terminator may swap their Balesword (points per model):
 *     - Bubonic axe +0 / Power fist +8
 *   • For every 5 models, two Terminators may swap their Combi-flamers (points per model):
 *     - Plague spewer +5 / Reaper autocannon +19 / Blight launcher +34
 *   • For every 5 models, two Terminators may swap their Combi-flamers and Baleswords (points per model):
 *     - Heavy plague weapon -6
 *   • The Terminator Champion has access to weapons and gear from the Armory.
 *   • The unit can gain a Veteran ability.
 *
 * ABILITIES (verbatim):
 *   Deep strike, Mark of Nurgle, Massive(1), Unyielding
 *   Cataphractii armor: The model has a 4+ invulnerability save.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Death Guard
 *
 * ARMOUR KEYWORD: Cataphractii — triggers ᵀ-gate (only ᵀ armory items allowed).
 *   SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
 *   receive equipment with ᵀ." → armourKeyword: "Cataphractii" ✅
 *
 * ENGINE STATUS:
 *   ✓ armourKeyword: "Cataphractii" → ᵀ-gate enforced via modelRestrictsToTermSubset()
 *   ✓ locked_mark: "Nurgle" → no mark selector shown
 *   ✓ veteran_max: 1 → only 1 veteran ability
 *   ✓ champion_has_armory: true → Terminator Champion gets armory access
 *   ✓ per_n:5/count_per_n:2 for heavy-weapon swaps (options 3 & 4)
 *   ❌ options 3 & 4 are conditional on having chosen Combi-flamer in option 1 — cross-option
 *      available_if not modeled (same gap as Noise Marines / Rubric Marines)
 *   ❌ replace drop-side: options name the dropped weapon in the header text only
 */

import type { Unit } from '../../../../../src/types/data';

export const blightlordTerminators: Unit = {
  "name": "Blightlord Terminators",
  "models": [
    {
      "name": "Terminator",
      "points": 109,
      "min": 4,
      "max": 13,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    },
    {
      "name": "Terminator Champion",
      "points": 114,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Balesword; Combi-bolter.",
  "weapons": [
    {
      "name": "Balesword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Blight launcher",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "2",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Bubotic axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Combi-bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Combi-flamer - Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Combi-flamer - Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Combi-melta - Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Combi-melta - Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Combi-plasma - Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Combi-plasma - Standard",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Combi-plasma - Supercharged",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Heavy plague weapon",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "Poison(4+), Slow(-1), Unwieldy"
    },
    {
      "name": "Plague spewer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
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
      "name": "Reaper autocannon",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Every Terminator may swap their Combi-bolter (points per model)",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Combi-flamer",
          "points": 0
        },
        {
          "name": "Combi-melta",
          "points": 6
        },
        {
          "name": "Combi-plasma",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combi-bolter"]
    },
    {
      "header": "Every Terminator may swap their Balesword (points per model)",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Bubotic axe",
          "points": 0
        },
        {
          "name": "Power fist",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Balesword"]
    },
    {
      "header": "For every 5 models, two Terminators may swap their Combi-flamers (points per model)",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Plague spewer",
          "points": 5
        },
        {
          "name": "Reaper autocannon",
          "points": 19
        },
        {
          "name": "Blight launcher",
          "points": 34
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combi-flamer"]
    },
    {
      "header": "For every 5 models, two Terminators may swap their Combi-flamers and Baleswords (points per model)",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Heavy plague weapon",
          "points": -6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combi-flamer", "Balesword"]
    }
  ],
  "abilities": [
    "Deep strike, Mark of Nurgle, Massive(1), Unyielding",
    "Cataphractii armor: The model has a 4+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Death Guard"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 550,
  "armourKeyword": "Cataphractii"
};
