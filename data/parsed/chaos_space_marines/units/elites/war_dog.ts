/**
 * WAR DOG — Elites
 *
 * SOURCE: Escalation supplement (no HTML in data/source/Chaos Space Marines ENG/)
 * ─────────────────────────────────────────────────────────────────────────────────
 * Data derived from production JSON (canonical); HTML source not available locally.
 *
 * PROFILE:
 *   No.  NAME                  M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1-2  War Dog Executioner   6”   3+  3+  6    12    11    11   4  3   3  196
 *
 * EQUIPPED WITH: A War Dog Executioner is equipped with: 2 Reaper chaintalons; Heavy stubber.
 *
 * WEAPONS:
 *   Avenger chaincannon    36”  Assault 10  6  AP-2  D1  Suppression
 *   Daemonbreath spear     24”  Heavy 1     9  AP-5  D3  AT(3), Armorbane
 *   Havoc launcher         48”  Heavy 1     5  AP-1  D1  Anti-Air, Explosive
 *   Heavy stubber          36”  Heavy 3     4  AP0   D1  Suppression
 *   Melta                  12”  Assault 1   8  AP-5  D1  AT(1), Melta
 *   Reaper chaintalon       —   Melee      +4  AP-3  D2  AT(2)
 *   Slaughterclaw           —   Melee      x2  AP-3  D3  AT(3)
 *   War Dog autocannon     48”  Heavy 2     7  AP-3  D2  Anti-Air, AT(1)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: K+10 / N+10 / S+10 / T+10 (no Undivided)
 *   • May swap first Reaper chaintalon:
 *     Slaughterclaw+2 / Daemonbreath spear+43 / War Dog autocannon+43 / Avenger chaincannon+75
 *   • May swap second Reaper chaintalon: same options
 *   • May swap Heavy stubber: Melta+2 / Havoc launcher+14
 *
 * ABILITIES (verbatim):
 *   Squadron
 *   Elite: Chaos armies may select units of War Dogs as an Elite choice.
 *   Ion shield: The model gains a 5+ invulnerability save against ranged attacks.
 *     During activation, select which facing the Ion shield covers (default: front).
 *
 * UNIT TYPE: Walker
 * KEYWORDS: Chaos Space Marine, Vehicle
 *
 * ENGINE STATUS:
 *   ✓ is_vehicle: true / is_squadron: true ✓
 *   ✓ marks: K/N/S/T — no Undivided ✓
 *   ✓ dual chaintalon swap: two separate option_groups (ki-escalation-wardog-dualswap-display-01
 *     cosmetic display issue pending)
 *   ✓ has_veteran_abilities: false / locked_mark: null ✓
 *   ✓ default_size: 1 / min_cost: 196 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const warDog: Unit = {
  "name": "War Dog",
  "models": [
    {
      "name": "War Dog Executioner",
      "points": 196,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "11",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A War Dog Executioner is equipped with: 2 Reaper chaintalons; Heavy stubber.",
  "weapons": [
    {
      "name": "Avenger chaincannon",
      "range": "36\"",
      "type": "Assault 10",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Daemonbreath spear",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Armorbane"
    },
    {
      "name": "Havoc launcher",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Explosive"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Reaper chaintalon",
      "range": "-",
      "type": "Melee",
      "s": "+4",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Slaughterclaw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "War Dog autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(1)"
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
      "header": "May swap the first Reaper chaintalon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Slaughterclaw",
          "points": 2
        },
        {
          "name": "Daemonbreath spear",
          "points": 43
        },
        {
          "name": "War Dog autocannon",
          "points": 43
        },
        {
          "name": "Avenger chaincannon",
          "points": 75
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Reaper chaintalon"]
    },
    {
      "header": "May swap the second Reaper chaintalon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Slaughterclaw",
          "points": 2
        },
        {
          "name": "Daemonbreath spear",
          "points": 43
        },
        {
          "name": "War Dog autocannon",
          "points": 43
        },
        {
          "name": "Avenger chaincannon",
          "points": 75
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Reaper chaintalon"]
    },
    {
      "header": "May swap the Heavy stubber",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Melta",
          "points": 2
        },
        {
          "name": "Havoc launcher",
          "points": 14
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Heavy stubber"
      ]
    }
  ],
  "abilities": [
    "Squadron",
    "Elite: Chaos armies may select units of War Dogs as an Elite choice.",
    "Ion shield: The model gains a 5+ invulnerability save against ranged attacks. During the activation, you have to select wether the Ion shield covers attacks from the front, the left side, the right side or the back. The default side is always the front."
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
  "has_veteran_abilities": false,
  "veteran_required": false,
  "advisor": false,
  "is_squadron": true,
  "locked_mark": null,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 196
};

