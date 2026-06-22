/**
 * KHORNE BERZERKERS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Khorne Berzerkers.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                 M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-7  Khorne Berzerker     6"   3+  3+  5  4  2  4  3   8  3+   46
 *   1    Berzerker Champion   6"   3+  3+  5  4  2  4  3   8  3+   51
 *
 * EQUIPPED WITH: Each model is equipped with: Chainaxe; Bolt pistol; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Bolt pistol                12"  Pistol 1   S4   AP-1  D1  -
 *   Eviscerator                 —   Melee      Sx2  AP-3  D2  AT(1), Armorbane, Slow(-2), Unwieldy
 *   Frag grenade               6"  Grenade 1  S4   AP 0  D1  Explosive
 *   Krak grenade               6"  Grenade 1  S6   AP-2  D1  -
 *   Chainaxe                   —   Melee      S+1  AP-1  D1  -
 *   Plasma pistol - Standard   12"  Pistol 1   S7   AP-3  D1  AT(1)
 *   Plasma pistol - Overcharged 12"  Pistol 1   S8   AP-4  D2  AT(2), Overheat
 *
 *   NOTE: HTML source labels the Krak grenade row as "Frag grenade" (copy-paste error
 *   in source spreadsheet) and Chainaxe type as "Nahkampf" (German for Melee — locale
 *   artifact). Production JSON is canonical here — both corrected.
 *
 * OPTIONS:
 *   • For each 4 models, two Berzerkers may swap their Bolt pistols:
 *     Plasma pistol +8 / Eviscerator +12
 *   • The Berzerker Champion has access to the armory.
 *   • This unit may receive one veteran ability.
 *
 * ABILITIES (verbatim): Berserk(5+), Blind rage, Mark of Khorne
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: World Eaters
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML (correcting source artefacts above)
 *   ✓ locked_mark: "Khorne" (from Mark of Khorne ability)
 *   ✓ per_n:4/count_per_n:2 for bolt pistol swap
 *   ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 1
 *   ✓ default_size: 5 / min_cost: 235 (4×46 + 1×51 = 235) ✓
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const khorneBerzerkers: Unit = {
  "name": "Khorne Berzerkers",
  "models": [
    {
      "name": "Khorne Berzerker",
      "points": 46,
      "min": 4,
      "max": 7,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Berzerker Champion",
      "points": 51,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Chainaxe; Bolt pistol; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Eviscerator",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Armorbane, Slow(-2), Unwieldy"
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
    },
    {
      "name": "Chainaxe",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma pistol - Standard",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma pistol - Overcharged",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    }
  ],
  "option_groups": [
    {
      "header": "For each 4 models, two Berzerkers may swap their Bolt pistols",
      "constraint": {
        "type": "per_n",
        "per_n": 4,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Plasma pistol",
          "points": 8
        },
        {
          "name": "Eviscerator",
          "points": 12
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt pistol"]
    }
  ],
  "abilities": [
    "Berserk(5+), Blind rage, Mark of Khorne"
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
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 235
};
