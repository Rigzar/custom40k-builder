/**
 * RED BUTCHER TERMINATORS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Red Butcher Terminators.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                    M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-8  Red Butcher Terminator  6"   2+  3+  5  5  2  4  4   8  2+   73
 *   1    Red Butcher Champion    6"   2+  3+  5  5  2  4  4   8  2+   78
 *
 * EQUIPPED WITH: Each model is equipped with: Twin Power axes.
 *
 * WEAPONS:
 *   Twin power axe   —  Melee  S+2  AP-2  D1  Flurry(1)
 *   Twin chainfist   —  Melee  Sx2  AP-4  D3  Armorbane, AT(3), Flurry(1), Slow(-3)
 *
 * OPTIONS:
 *   • The Red Butcher Champion may swap their Twin power axe:
 *     Twin chainfist +26 pts
 *   • The Red Butcher Champion has access to gear from the Armory.
 *   • May have up to 1 veteran ability.
 *
 * ABILITIES (verbatim):
 *   Blind Rage, Deep strike, Mark of Khorne, Massive(1), Unyielding
 *   Cataphractii armor: The model has a 4+ invulnerability save.
 *
 *   NOTE: "Blind Rage" (capital R) on this sheet vs "Blind rage" on Khorne Berzerkers —
 *   per FAQ #5 each sheet is canonical for its own ability name.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: World Eaters
 *
 * ARMOUR KEYWORD: Cataphractii — triggers ᵀ-gate (only ᵀ armory items allowed).
 *   SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
 *   receive equipment with ᵀ." → armourKeyword: "Cataphractii" ✅
 *
 * ENGINE STATUS:
 *   ✓ armourKeyword: "Cataphractii" → ᵀ-gate enforced
 *   ✓ locked_mark: "Khorne" (from Mark of Khorne ability)
 *   ✓ champion-only swap: constraint "one" with Twin chainfist +26
 *   ✓ champion_has_armory: true / veteran_max: 1
 *   ✓ default_size: 5 / min_cost: 370 (4×73 + 1×78 = 370) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const redButcherTerminators: Unit = {
  "name": "Red Butcher Terminators",
  "models": [
    {
      "name": "Red Butcher Terminator",
      "points": 73,
      "min": 4,
      "max": 8,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "2+"
      }
    },
    {
      "name": "Red Butcher Champion",
      "points": 78,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "4",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Twin Power axes.",
  "weapons": [
    {
      "name": "Twin chainfist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "Armorbane, AT(3), Flurry(1), Slow(-3)"
    },
    {
      "name": "Twin power axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(1)"
    }
  ],
  "option_groups": [
    {
      "header": "The Red Butcher Champion may swap their Twin power axe",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin chainfist",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin power axe"]
    }
  ],
  "abilities": [
    "Blind Rage, Deep strike, Mark of Khorne, Massive(1), Unyielding",
    "Cataphractii armor: The model has a 4+ invulnerability save."
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
  "armory_gear_only": true,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 370,
  "armourKeyword": "Cataphractii"
};
