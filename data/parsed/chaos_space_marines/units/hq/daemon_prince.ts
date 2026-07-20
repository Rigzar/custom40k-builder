/**
 * DAEMON PRINCE — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Daemon Prince.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME           M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   1    Daemon Prince  6”   2+  2+  6  6  6  5  4   9  3+   184
 *
 * EQUIPPED WITH: A Daemon prince is equipped with: Malefic talons.
 *
 * WEAPONS:
 *   Hellforged blade    —   Melee     +2  AP-4  D2  AT(2)               [option]
 *   Malefic talons      —   Melee      U  AP-2  D1  Flurry(2)           [default]
 *   Plague spewer      9”   Assault 4  5  AP-1  D1  Flames, Poison(4+)  [option, Nurgle only]
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: K+11 / S+11 / N+28 / T+24
 *     (NO Undivided option — only 4 marks available)
 *   • Can get one of the following weapons: Plague spewer (Nurgle only) +13
 *   • Can get the following weapon: Hellforged blade +18
 *   • If no Mark of Khorne, can be upgraded to a psyker +5
 *   • Can be equipped with wings +37: gain +6” M and “Jump pack infantry” unit type
 *   • Has armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Deep strike, Daemon, Daemonic instability, Terrifying(-1)
 *   Psyker: The model can cast 1 power and deny 1 power per battle round.
 *     He knows Smite and 1 power from a chosen discipline.
 *
 * UNIT TYPE: Monstrous Creature
 * KEYWORDS: Chaos Space Marine
 *   (TS also has “Monster” — production semantic for is_monster: true)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly
 *   ✓ all 3 weapons match HTML exactly
 *   ✓ marks: K/S/N/T only — no Undivided (correct per HTML) ✓
 *   ✓ Plague spewer available_if: instanceOf Nurgle ✓
 *   ✓ Plague spewer option choice name == weapon name "Plague spewer" (NOT "... (Nurgle only)")
 *     so computeWeaponsToShow hides it until picked — a mismatch made it a phantom default that
 *     always showed in the live profile for any mark (v1.55 fix).
 *   ✓ Wings effect: stat_mod M+6 + adds_unit_types [“Jump pack infantry”] ✓
 *   ⚠ Wings effect missing grants_abilities: [“Deep Strike”] — armory jump-pack and
 *     possessed.ts include this; Daemon Prince wings option should too (ENGINE TODO)
 *   ✓ is_psyker: false (psyker is conditional option — base unit is not a psyker) ✓
 *   ✓ is_monster: true / is_character: true / has_armory_access: true / veteran_max: 2 ✓
 *   ✓ unit_type: “Monstrous Creature” / default_size: 1 / min_cost: 184 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const daemonPrince: Unit = {
  "name": "Daemon Prince",
  "models": [
    {
      "name": "Daemon Prince",
      "points": 184,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "6",
        "W": "6",
        "I": "5",
        "A": "4",
        "LD": "9",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Daemon prince is equipped with: Malefic talons.",
  "weapons": [
    {
      "name": "Hellforged blade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Malefic talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Plague spewer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
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
          "name": "Khorne",
          "points": 11
        },
        {
          "name": "Slaanesh",
          "points": 11
        },
        {
          "name": "Nurgle",
          "points": 28
        },
        {
          "name": "Tzeentch",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can get the following weapon (Nurgle only)",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Plague spewer",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "available_if": {
        "type": "instanceOf",
        "scope": "unit",
        "keyword": "Nurgle"
      }
    },
    {
      "header": "Can get the following weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hellforged blade",
          "points": 18
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If no Mark of Khorne is taken, can be upgraded to a psyker for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false,
      "available_if": {
        "type": "notInstanceOf",
        "scope": "unit",
        "keyword": "Khorne"
      }
    },
    {
      "header": "Can be equipped with wings for +37 points to gain +6\" M and the \"Jump pack infantry\" Unit type.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 37,
      "variant_link": null,
      "is_unique_per_army": false,
      "effect": {
        "stat_mod": [
          {
            "stat": "M",
            "delta": 6
          }
        ],
        "adds_unit_types": [
          "Jump pack infantry"
        ]
      }
    }
  ],
  "abilities": [
    "Deep strike, Daemon, Daemonic instability, Terrifying(-1)",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Chaos Space Marine",
    "Monster"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": true,
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
  "min_cost": 184
};

