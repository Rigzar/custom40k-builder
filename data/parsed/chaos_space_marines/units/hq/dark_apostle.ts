/**
 * DARK APOSTLE — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Dark Apostle.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME             M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   1    Dark Apostle     6”   2+  3+  4  4  4  5  2   8  3+   134
 *   1    Sinister Bishop  6”   2+  3+  4  4  4  5  3   9  3+   154  [upgrade, unique per army]
 *   (HTML row 5 has No.=1 for Sinister Bishop, not “*” — alternate profile for same single model)
 *
 * EQUIPPED WITH: A Dark Apostle is equipped with: Crozius Maleficum; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Crozius Maleficum  —   Melee     +2  AP-2  D2  —
 *   Frag grenade       6”  Grenade 1  4  AP0   D1  Explosive
 *   Krak grenade       6”  Grenade 1  6  AP-2  D1  —
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
 *   • One Dark Apostle per army can be upgraded to a Sinister Bishop for +20 points (→A3, LD9)
 *   • Has armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Faithful: A Dark Apostle may pray once per turn. A prayer is successful at a roll of 3+.
 *     A Dark Apostle knows all prayers to the dark gods.
 *   Seal of corruption: This model has a 4+ invulnerable save.
 *   Sinister Bishop: A Sinister Bishop may pray one additional time per battle round.
 *
 * UNIT TYPE: Character model, Infantry
 * KEYWORDS: Chaos Space Marine
 *   (TS also has “Priest” — production semantic; is_priest: true activates prayer modal)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (base + Sinister Bishop variant)
 *   ✓ all 3 weapons match HTML exactly
 *   ✓ marks: all 5 including Undivided+0 ✓
 *   ✓ variant_link: “Sinister Bishop”, is_unique_per_army: true ✓
 *   ✓ abilities text verbatim match ✓
 *   ✓ is_priest: true / is_psyker: false ✓
 *   ✓ is_character: true / has_armory_access: true / veteran_max: 2 ✓
 *   ✓ default_size: 1 / min_cost: 134 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const darkApostle: Unit = {
  "name": "Dark Apostle",
  "models": [
    {
      "name": "Dark Apostle",
      "points": 134,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Sinister Bishop",
      "points": 154,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Dark Apostle is equipped with: Crozius Maleficum; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Crozius Maleficum",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
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
          "points": 8
        },
        {
          "name": "Slaanesh",
          "points": 8
        },
        {
          "name": "Nurgle",
          "points": 20
        },
        {
          "name": "Tzeentch",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Dark Apostle per army can be upgraded to a Sinister Bishop for +20 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 20,
      "variant_link": "Sinister Bishop",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Faithful: A Dark Apostle may pray once per turn. A prayer is successful at a roll of 3+. A Dark Apostle knows all prayers to the dark gods.",
    "Seal of corruption: This model has a 4+ invulnerable save.",
    "Sinister Bishop: A Sinister Bishop may pray one additional time per battle round."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Chaos Space Marine",
    "Priest"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 134,
  "is_priest": true
};

