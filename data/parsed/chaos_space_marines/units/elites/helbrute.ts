/**
 * HELBRUTE — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Helbrute.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME     M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1-2  Helbrute 6”   3+  3+  6    12    12    10   4  3   3  174
 *
 * EQUIPPED WITH: A Helbrute is equipped with: Helbrute fist; Power scourge.
 *
 * WEAPONS:
 *   Combi-bolter              24”  Rapid fire 2  4   AP-1  D1  —
 *   Heavy flamer               9”  Assault 4     5   AP-1  D1  Flames
 *   Helbrute fist              —   Melee        x2   AP-3  D2  AT(2)
 *   Helbrute hammer            —   Melee        x2   AP-3  D3  AT(3), Armorbane
 *   Helbrute plasma cannon    36”  Heavy 1       8   AP-4  D2  AT(2), Explosive, Overheat
 *   Multi-melta               24”  Assault 1     8   AP-5  D2  AT(2), Melta
 *   Missile launcher - Frag   48”  Heavy 1       4   AP0   D1  Explosive
 *   Missile launcher - Krak   48”  Heavy 1       8   AP-3  D2  AT(2), Anti-air
 *   Power scourge              —   Melee         U   AP-2  D1  Flurry(4)
 *   Reaper autocannon         36”  Heavy 4       7   AP-2  D1  AT(1)
 *   Twin heavy bolter         36”  Rapid Fire 4  5   AP-2  D1  —
 *   Twin lascannon            48”  Heavy 2       9   AP-4  D3  AT(3)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: K+10 / N+10 / S+10 / T+10 (NO Undivided)
 *   • May replace Helbrute fist:
 *     Reaper autocannon+15 / Twin heavy bolter+20 / Multi-melta+21 /
 *     Helbrute plasma cannon+86 / Twin lascannon+122
 *   • May replace Power scourge:
 *     Helbrute fist+0 / Helbrute hammer+7 / Missile launcher+24
 *   • For every Helbrute fist may add: Combi-bolter+11 / Heavy flamer+13
 *   • Has armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Squadron
 *   Furioso: If the model is equipped with two melee weapons, it gains +2 attacks.
 *
 * UNIT TYPE: Walker
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, all weapons match HTML exactly
 *   ✓ marks: K/N/S/T only — no Undivided ✓
 *   ✓ Furioso: ability string (no mechanical support needed for display) ✓
 *   ✓ keywords: [“Chaos Space Marine”, “Vehicle”] — “Vehicle” is production semantic ✓
 *   ✓ is_vehicle: true / is_squadron: true (via “Squadron” ability) ✓
 *   🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true; veteran_max: 2 stays correct).
 *     The OPTIONS line "Has access to vehicle equipment from the Armory" is a DISTINCT, narrower
 *     grant than "weapons and gear from the Armory" (used on CSM characters like Sorcerer/Dark
 *     Apostle) — despite Helbrute's unit_type being "Walker", its Armory access is vehicle-
 *     equipment-scoped (consistent with is_vehicle: true). "Vehicle equipment" = the Vehicle
 *     Upgrades list ONLY, already shown automatically via is_vehicle + category:'vehicle' items
 *     (UnitCard.tsx hasFactionVehicleItems — independent of this flag); it does NOT grant the
 *     general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old `true` value wrongly
 *     opened that general armory tab. (This session's earlier SOURCE-pass note glossed "Has armory
 *     access" without preserving the "vehicle equipment" qualifier — fixed after cross-referencing
 *     engine code + verbatim text comparison across all CSM vehicles.)
 *   ✓ default_size: 1 / min_cost: 174 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const helbrute: Unit = {
  "name": "Helbrute",
  "models": [
    {
      "name": "Helbrute",
      "points": 174,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Helbrute is equipped with: Helbrute fist; Power scourge.",
  "weapons": [
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
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Helbrute fist",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Helbrute hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Armorbane"
    },
    {
      "name": "Helbrute plasma cannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheat"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Power scourge",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(4)"
    },
    {
      "name": "Reaper autocannon",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
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
          "points": 10
        },
        {
          "name": "Nurgle",
          "points": 10
        },
        {
          "name": "Slaanesh",
          "points": 10
        },
        {
          "name": "Tzeentch",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May replace its Helbrute fist",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Reaper autocannon",
          "points": 15
        },
        {
          "name": "Twin heavy bolter",
          "points": 20
        },
        {
          "name": "Multi-melta",
          "points": 21
        },
        {
          "name": "Helbrute plasma cannon",
          "points": 86
        },
        {
          "name": "Twin lascannon",
          "points": 122
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Helbrute fist"
      ]
    },
    {
      "header": "May replace its Power scourge",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Helbrute fist",
          "points": 0
        },
        {
          "name": "Helbrute hammer",
          "points": 7
        },
        {
          "name": "Missile launcher",
          "points": 24
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Power scourge"
      ]
    },
    {
      "header": "For every Helbrute fist, it may be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Combi-bolter",
          "points": 11
        },
        {
          "name": "Heavy flamer",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Squadron",
    "Furioso: If the model is equipped with two melee weapons, it gains +2 attacks."
  ],
  "unit_type": "Walker",
  "keywords": [
    "Chaos Space Marine",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 174
};

