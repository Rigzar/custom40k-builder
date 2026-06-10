/**
 * CHAOS TERMINATORS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Terminators.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-9  Chaos Terminator    6"   3+  3+  4  5  2  4  3   8  2+   68
 *   1    Terminator Champion 6"   3+  3+  4  5  2  4  3   8  2+   73
 *
 * EQUIPPED WITH: Each model is equipped with: Combi-Bolter; Power sword.
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (pts per model):
 *     Khorne +2 / Slaanesh +2 / Nurgle +2 / Tzeentch +5  (NO Undivided option)
 *   • Every Chaos Terminator may swap their Combi-bolter with:
 *     Combi-flamer +0 / Combi-melta +5 / Combi-plasma +10
 *   • Every Chaos Terminator may swap their Power sword with:
 *     Power axe +0 / Power maul +0 / Lightning claw +1 / Power fist +9 / Chainfist +17
 *   • Every Chaos Terminator may swap their Combi-bolter and Power sword with:
 *     Pair of lightning claws -13
 *   • For each 5 models, two Terminators may swap their Combi-bolters with:
 *     Heavy flamer +2 / Reaper autocannon +20
 *   • The Terminator Champion has access to weapons and gear from the Armory.
 *   • May have up to 2 veteran abilities.
 *
 * ABILITIES (verbatim):
 *   Deep strike, Massive(1), Unyielding
 *   Crux Terminatus: This unit has a 5+ invulnerable save.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ARMOUR KEYWORD: Terminator — triggers ᵀ-gate (Crux Terminatus = 5+ inv).
 *   SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
 *   receive equipment with ᵀ." → armourKeyword: "Terminator" ✅
 *
 * NOTE — Combi sub-profiles: each Combi-* weapon is a combined weapon with two
 *   firing modes listed separately on the datasheet. Plasma Overcharged is
 *   "Overheat" on this sheet (not "Overheating" as on the Blightlord sheet —
 *   each datasheet is canonical for itself per FAQ #5).
 *
 * ENGINE STATUS:
 *   ✓ armourKeyword: "Terminator" → ᵀ-gate enforced via modelRestrictsToTermSubset()
 *   ✓ Mark pricing: no Undivided option (choices[] has only 4 gods)
 *   ✓ veteran_max: 2
 *   ✓ champion_has_armory: true
 *   ✓ per_n:5/count_per_n:2 heavy-weapon swap
 *   ❌ replace drop-side: Combi swaps / lightning-claw dual swap — dropped weapons in header only
 *   ❌ cross-option mutual-exclusion: Combi swap (opt 2) and pair-of-claws (opt 4) both affect
 *      Combi-bolter — a model that took opt 4 can't also take opt 2, not enforced
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosTerminators: Unit = {
  "name": "Chaos Terminators",
  "models": [
    {
      "name": "Chaos Terminator",
      "points": 68,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    },
    {
      "name": "Terminator Champion",
      "points": 73,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Combi-Bolter; Power sword.",
  "weapons": [
    {
      "name": "Chainfist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "Armorbane, AT(3), Slow(-3)"
    },
    {
      "name": "Lightning claw",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Combi-bolter",
      "range": "24\"",
      "type": "Rapid fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-flamer - Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-plasma - Standard",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Combi-plasma - Overcharged",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    },
    {
      "name": "Heavy Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Pair of lightning claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2), Shred, Unwieldy"
    },
    {
      "name": "Power axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
      "name": "Power maul",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
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
      "header": "All models may receive a Mark of Chaos (pts per model)",
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
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Every Chaos Terminator may swap their Combi-bolter with",
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
          "points": 5
        },
        {
          "name": "Combi-plasma",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Every Chaos Terminator may swap their Power sword with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Power axe",
          "points": 0
        },
        {
          "name": "Power maul",
          "points": 0
        },
        {
          "name": "Lightning claw",
          "points": 1
        },
        {
          "name": "Power fist",
          "points": 9
        },
        {
          "name": "Chainfist",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Every Chaos Terminator may swap their Combi-bolter and Power sword with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Pair of lightning claws",
          "points": -13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each 5 models, two Terminators may swap their Combi-bolters with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 2
        },
        {
          "name": "Reaper autocannon",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deep strike, Massive(1), Unyielding",
    "Crux Terminatus: This unit has a 5+ invulnerable save."
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
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 345,
  "armourKeyword": "Terminator"
};
