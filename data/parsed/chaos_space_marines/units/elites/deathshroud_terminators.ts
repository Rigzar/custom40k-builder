/**
 * DEATHSHROUD TERMINATORS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Deathshroud Terminators.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                            M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   2-6  Deathshroud Terminator          6"   2+  3+  4  6  3  4  3   9  2+  117
 *   1    Deathshroud Terminator Champion  6"   2+  3+  4  6  3  4  3   9  2+  122
 *
 * EQUIPPED WITH: Every model is equipped with: Manreaper; Plaguespurt gauntlet.
 *
 * WEAPONS:
 *   Manreaper * (choose one profile):
 *     Cleave  —  Melee  S+3  AP-3  D2  AT(1), Poison(4+), Slow(-1), Unwieldy
 *     Scythe  —  Melee  S+1  AP-3  D1  Poison(4+), Flurry(1), Unwieldy
 *   Plaguespurt gauntlet  6"  Pistol 4  S4  AP0  D1  Flames, Poison(4+)
 *
 * OPTIONS:
 *   • The Terminator Champion has access to weapons and gear from the Armory.
 *   • The unit can gain a Veteran ability.
 *
 * ABILITIES (verbatim):
 *   Bodyguard, Deepstrike, Mark of Nurgle, Massive(1), Unyielding
 *   Cataphractii armor: The model has a 4+ invulnerability save.
 *   Eyes of Mortarion: Attached HQ models gain +1 attack in melee.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Death Guard
 *
 * ARMOUR KEYWORD: Cataphractii — triggers ᵀ-gate (only ᵀ armory items allowed).
 *   SOURCE (Armory.html): "Models wearing Cataphractii or Terminator armor can only
 *   receive equipment with ᵀ." → armourKeyword: "Cataphractii" ✅
 *
 * ENGINE STATUS:
 *   ✓ armourKeyword: "Cataphractii" → ᵀ-gate enforced
 *   ✓ locked_mark: "Nurgle" → no mark selector shown
 *   ✓ veteran_max: 1 → only 1 veteran ability
 *   ✓ champion_has_armory: true → Terminator Champion gets armory access
 *   ✓ Manreaper dual-profile (Cleave/Scythe) correctly encoded as separate weapon entries
 *   ✓ no option_groups needed — champion armory + vet ability encoded as flags
 *   ✓ default_size: 3 / min_cost: 356 (2×117 + 1×122 = 356) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const deathshroudTerminators: Unit = {
  "name": "Deathshroud Terminators",
  "models": [
    {
      "name": "Deathshroud Terminator",
      "points": 117,
      "min": 2,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    },
    {
      "name": "Deathshroud Terminator Champion",
      "points": 122,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "6",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Manreaper; Plaguespurt gauntlet.",
  "weapons": [
    {
      "name": "Plaguespurt gauntlet",
      "range": "6\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    },
    {
      "name": "Manreaper - Cleave",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Poison(4+), Slow(-1), Unwieldy"
    },
    {
      "name": "Manreaper - Scythe",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Poison(4+), Flurry(1), Unwieldy"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Bodyguard, Deepstrike, Mark of Nurgle, Massive(1), Unyielding",
    "Cataphractii armor: The model has a 4+ invulnerability save.",
    "Eyes of Mortarion: Attached HQ models gain +1 attack in melee."
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
  "default_size": 3,
  "min_cost": 356,
  "armourKeyword": "Cataphractii"
};
