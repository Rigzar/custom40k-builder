/**
 * RAPTORS — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Raptors.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.    NAME                       M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-14   Raptor                     12"  3+  3+  4  4  2  4  2   7  3+   43
 *   1      Raptor Champion            12"  3+  3+  4  4  2  4  2   7  3+   43
 *   *      Aspiring Raptor Champion   12"  3+  3+  4  4  2  4  2   8  3+   53  (variant, Champion upgrade)
 *
 * EQUIPPED WITH: Each model is equipped with: Astartes Chainsword; Bolt pistol;
 *   Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Astartes Chainsword          -    Melee         SU   AP-1  D1  -
 *   Bolt pistol                 12"  Pistol 1      S4   AP-1  D1  -
 *   Flamer                       9"  Assault 4     S4   AP 0  D1  Flames
 *   Frag grenade                 6"  Grenade 1     S4   AP 0  D1  Explosive
 *   Krak grenade                 6"  Grenade 1     S6   AP-2  D1  -
 *   Meltagun                    12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Plasma gun - Standard       24"  Rapid fire 1  S7   AP-3  D1  AT(1)
 *   Plasma gun - Overcharged    24"  Rapid fire 1  S8   AP-4  D2  AT(2), Overheat
 *   Plasma pistol - Standard    12"  Pistol 1      S7   AP-3  D1  AT(1)
 *   Plasma pistol - Overcharged 12"  Pistol 1      S8   AP-4  D2  AT(2), Overheat
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): Khorne/Slaanesh/Nurgle +2pts,
 *     Tzeentch +5pts
 *   • Two Raptors may swap their Bolt pistols each: Plasma pistol +8
 *   • Alternatively, two Raptors may swap their Astartes chainswords AND Bolt pistols each:
 *     Flamer +0 / Meltagun +12 / Plasma gun +17
 *   • The Raptor Champion may be upgraded to an Aspiring Raptor Champion for +10pts and
 *     gains access to weapons and gear from the Armory
 *   • May have up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Deep strike
 *
 * UNIT TYPE: Jump pack infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML verbatim (Flamer/Meltagun ranges keep source's
 *     "9''"/"12''" double-prime artefact, consistent with prod JSON convention elsewhere)
 *   ✓ variant_models: Aspiring Raptor Champion (champion upgrade, variant_link)
 *   ✓ option_groups: mark (per-model) / fixed_max(2) Bolt-pistol swap (Plasma pistol only —
 *     matches; only ONE choice listed in source for this group, unlike Chaos Bikers' 3-choice
 *     analogue) / fixed_max(2) chainsword+pistol swap / champion→variant "one" (inline_pts 10)
 *   ✓ unit_type: "Jump Pack Infantry" — title-cased from source's "Jump pack infantry"
 *     (global unit_type casing normalization, ki-jumppack-otherfactions-01 fix, v0.51)
 *   ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 2
 *   ✓ keywords: ["Chaos Space Marine"] / default_size: 5 (4 Raptors + 1 Champion) /
 *     min_cost: 215 (4×43 + 43) ✓
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const raptors: Unit = {
  "name": "Raptors",
  "models": [
    {
      "name": "Raptor",
      "points": 43,
      "min": 4,
      "max": 14,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Raptor Champion",
      "points": 43,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Aspiring Raptor Champion",
      "points": 53,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
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
  "equipped_with": "Each model is equipped with: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Flamer",
      "range": "9''",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Meltagun",
      "range": "12''",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun - Overcharged",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
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
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Two Raptors may swap their Bolt pistols each",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Plasma pistol",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt pistol"]
    },
    {
      "header": "Alternatively, two Raptors may swap their Astartes chainswords and Bolt pistols each",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 0
        },
        {
          "name": "Meltagun",
          "points": 12
        },
        {
          "name": "Plasma gun",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Astartes Chainsword", "Bolt pistol"]
    },
    {
      "header": "The Raptor Champion may be upgraded to an Aspiring Raptor Champion for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Aspiring Raptor Champion",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deep strike"
  ],
  "unit_type": "Jump Pack Infantry",
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 215
};
