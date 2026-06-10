/**
 * PLAGUE MARINES — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Plague Marines.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME             M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-13  Plague Marine    6"   3+  3+  4  5  3  4  2   8  3+   53
 *   1     Plague Champion  6"   3+  3+  4  5  3  4  2   8  3+   58
 *
 * EQUIPPED WITH: Every model is equipped with: Blight grenades; Bolter; Krak grenades; Plague knife.
 *
 * WEAPONS:
 *   Blight grenades          6"   Grenade 1     S4   AP 0  D1  Explosive, Poison(4+)
 *   Blight launcher         24"   Assault 2     S6   AP-2  D2  Poison(4+)
 *   Bolter                  24"   Rapid Fire 1  S4   AP-1  D1  Poison(4+)
 *   Heavy plague weapon      —    Melee         S+2  AP-3  D2  Poison(4+), Slow(-1), Unwieldy
 *   Krak grenades            6"   Grenade 1     S6   AP-2  D1  -
 *   Light plague weapon      —    Melee         S+1  AP-2  D1  Flurry(2), Poison(4+)
 *   Meltagun                12"   Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Plague belcher           9"   Assault 4     S4   AP 0  D1  Flames, Poison(4+)
 *   Plague knife             —    Melee         SU   AP 0  D1  Poison(4+)
 *   Plague spewer            9"   Assault 4     S5   AP-1  D1  Flames, Poison(4+)
 *   Plasma gun - Standard   24"   Rapid Fire 1  S7   AP-3  D1  AT(1)
 *   Plasma gun - Overcharged 24"  Rapid Fire 1  S8   AP-4  D2  AT(2), Overheating
 *
 *   NOTE: "Overheating" (not "Overheat") per this datasheet — per FAQ #5 each sheet is canonical.
 *
 * OPTIONS:
 *   • For every 5 models, two Plague Marines may swap their Bolters (pts per model):
 *     Plague belcher +0 / Meltagun +11 / Plague spewer +11 / Heavy plague weapon +12 /
 *     Plasma gun +16 / Blight launcher +28
 *   • For every 5 models, two additional Plague Marines may swap their Bolters:
 *     Light plague weapon +3 / Heavy plague weapon +8
 *   • One model may be equipped with:
 *     Icon of Nurgle +10 / Plague banner +25
 *   • The Plague Champion has access to weapons and gear from the Armory.
 *   • The unit can gain a Veteran ability.
 *
 * ABILITIES (verbatim):
 *   Mark of Nurgle
 *   Icon of Nurgle: A friendly Daemon unit arriving within 7" of the bearer via deepstrike does not scatter.
 *   Plague banner: The unit gains the effects of an Icon of Nurgle. Additionally it gains a bonus
 *     of +1 to Leadership and Combat resolutions. As long as the banner bearer is alive, Mission
 *     objectives that are held by this unit can not be contested by enemy units.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Death Guard
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, all 12 weapons match HTML exactly
 *   ✓ locked_mark: "Nurgle" (from Mark of Nurgle ability)
 *   ✓ champion_has_armory: true / veteran_max: 1
 *   ✓ per_n:5/count_per_n:2 for both heavy-weapon swap groups
 *   ✓ Icon of Nurgle / Plague banner as option_group constraint "one"
 *   ✓ conditional abilities (Icon/Banner) encoded as always-visible ability strings —
 *     functionally correct (they only apply when the option is purchased, engine doesn't filter)
 *   ✓ default_size: 5 / min_cost: 270 (4×53 + 1×58 = 270) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const plagueMarines: Unit = {
  "name": "Plague Marines",
  "models": [
    {
      "name": "Plague Marine",
      "points": 53,
      "min": 4,
      "max": 13,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Plague Champion",
      "points": 58,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Blight grenades; Bolter; Krak grenades; Plague knife.",
  "weapons": [
    {
      "name": "Blight grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Poison(4+)"
    },
    {
      "name": "Blight launcher",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-2",
      "d": "2",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Heavy plague weapon",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "Poison(4+), Slow(-1), Unwieldy"
    },
    {
      "name": "Krak grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Light plague weapon",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2), Poison(4+)"
    },
    {
      "name": "Meltagun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Plague belcher",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    },
    {
      "name": "Plague knife",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Plague spewer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    },
    {
      "name": "Plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun - Overcharged",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, two Plague Marines may swap their Bolters (points per model)",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Plague belcher",
          "points": 0
        },
        {
          "name": "Meltagun",
          "points": 11
        },
        {
          "name": "Plague spewer",
          "points": 11
        },
        {
          "name": "Heavy plague weapon",
          "points": 12
        },
        {
          "name": "Plasma gun",
          "points": 16
        },
        {
          "name": "Blight launcher",
          "points": 28
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 5 models, two additional Plague Marines may swap their Bolters",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Light plague weapon",
          "points": 3
        },
        {
          "name": "Heavy plague weapon",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Icon of Nurgle",
          "points": 10
        },
        {
          "name": "Plague banner",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Mark of Nurgle",
    "Icon of Nurgle: A friendly Daemon unit arriving within 7\" of the bearer via deepstrike does not scatter.",
    "Plague banner: The unit gains the effects of an Icon of Nurgle. Additionally it gains a bonus of +1 to Leadership and Combat resolutions. As long as the banner bearer is alive, Mission objectives that are held by this unit can not be contested by enemy units."
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
  "default_size": 5,
  "min_cost": 270
};
