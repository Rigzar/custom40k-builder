/**
 * WARPSMITH — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Warpsmith.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                    M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   1    Warpsmith               6”   3+  2+  4  4  4  5  2   8  2+   119
 *   *    Daemonforge Mastersmith  6”   3+  2+  4  4  4  5  3   9  2+   134  [upgrade]
 *
 * EQUIPPED WITH: A Warpsmith is equipped with: Flamer tendril; Meltagun tendril;
 *   Omnissiah power axe; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Frag grenade          6”   Grenade 1   4  AP0   D1  Explosive
 *   Flamer tendril        9”   Assault 4   4  AP0   D1  Flames
 *   Krak grenade          6”   Grenade 1   6  AP-2  D1  —
 *   Meltagun tendril      12”  Assault 1   8  AP-5  D1  AT(1), Melta, Flurry(1)
 *   Omnissiah power axe    —   Melee      +2  AP-2  D2  —
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
 *   • One Warpsmith per army can be upgraded to a Daemonforge Mastersmith for +15 points
 *   • Has armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Blessing of the Omnissiah: At the end of its move, the model may attempt to repair a
 *     vehicle within 6”. On a 4+, one “Weapon destroyed” or “Engine damage” result is removed
 *     from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6” can
 *     reroll a hit roll and a wound or armor penetration roll.
 *   Daemonforge Mastersmith: A Daemonforge Mastersmith may use the “Blessing of the
 *     Omnissiah” twice.
 *
 * UNIT TYPE: Character model, Infantry
 * KEYWORDS: Chaos Space Marine
 *   (TS also has “Warpsmith” — production semantic used by engine for faction rules)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (base + Daemonforge Mastersmith variant)
 *   ✓ all 5 weapons match HTML exactly
 *   ✓ marks: all 5 including Undivided+0 ✓
 *   ✓ variant_link: “Daemonforge Mastersmith”, is_unique_per_army: true ✓
 *   ✓ abilities text verbatim match ✓
 *   ✓ is_character: true / has_armory_access: true / veteran_max: 2 ✓
 *   ✓ default_size: 1 / min_cost: 119 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const warpsmith: Unit = {
  "name": "Warpsmith",
  "models": [
    {
      "name": "Warpsmith",
      "points": 119,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Daemonforge Mastersmith",
      "points": 134,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "equipped_with": "A Warpsmith is equipped with: Flamer tendril; Meltagun tendril; Omnissiah power axe; Frag grenades; Krak grenades.",
  "weapons": [
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
      "name": "Flamer tendril",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Meltagun tendril",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta, Flurry(1)"
    },
    {
      "name": "Omnissiah power axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
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
      "header": "One Warpsmith per army can be upgraded to a Daemonforge Mastersmith for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Daemonforge Mastersmith",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Blessing of the Omnissiah: At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a wound or armor penetration roll.",
    "Daemonforge Mastersmith: A Daemonforge Mastersmith may use the \"Blessing of the Omnissiah\" twice."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Chaos Space Marine",
    "Warpsmith"
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
  "min_cost": 119
};

