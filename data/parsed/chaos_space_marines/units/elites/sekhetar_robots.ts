/**
 * SEKHETAR ROBOTS — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Sekhetar Robots.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME            M    WS  BS  S  T  W  I  A  LD   SV  PTS
 *   2-4  Sekhetar Robot  6"   4+  4+  5  6  3  3  2  10   3+  148
 *
 * EQUIPPED WITH: Every model is equipped with: Heavy warpflamer; Hellfyre missile rack; Pyreflux meltagun.
 *
 * WEAPONS:
 *   Heavy warpflamer      9"   Assault 4  S5  AP-2  D1  Flames
 *   Hellfyre missile rack 36"  Heavy 2    S8  AP-2  D2  AT(2), Anti-air
 *   Pyreflux meltagun      9"  Assault 1  S9  AP-5  D1  AT(1), Melta
 *   Power claw             —   Melee      Sx2 AP-3  D2  AT(1)         [swap option]
 *   Warpflame projector    6"  Pistol 4   S4  AP-1  D1  Flames         [swap option]
 *
 * OPTIONS:
 *   • Any model may swap their Pyreflux meltagun:
 *     Power claw and warpflame projector +5 pts
 *
 * ABILITIES (verbatim):
 *   Infiltrate, Mark of Tzeentch, Unyielding
 *   Battle Protocols: Select one Battle Protocol during each activation:
 *   - Aegis: All models in the unit gain +1 Toughness. Default in first battle round.
 *   - Conqueror: All models in the unit gain +1 WS.
 *   - Protector: All models in the unit gain +1 BS.
 *
 * UNIT TYPE: Monstrous infantry
 * KEYWORDS: Thousand Sons
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, all weapons match HTML exactly
 *   ✓ locked_mark: "Tzeentch" (from Mark of Tzeentch ability)
 *   ✓ unit_type: "Monstrous Infantry" ✓
 *   ✓ weapon swap: constraint "every", choices [Power claw and warpflame projector +5]
 *   ✓ Battle Protocols encoded as ability strings (no mechanichal engine support needed)
 *   ✓ champion_has_armory: false / has_armory_access: false (no armory in HTML)
 *   ✓ has_veteran_abilities: false / veteran_max: null (no veteran option in HTML)
 *   ✓ default_size: 2 / min_cost: 296 (2×148 = 296) ✓
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const sekhetarRobots: Unit = {
  "name": "Sekhetar Robots",
  "models": [
    {
      "name": "Sekhetar Robot",
      "points": 148,
      "min": 2,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "6",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Heavy warpflamer; Hellfyre missile rack; Pyreflux meltagun.",
  "weapons": [
    {
      "name": "Heavy warpflamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Hellfyre missile rack",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Power claw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Pyreflux meltagun",
      "range": "9\"",
      "type": "Assault 1",
      "s": "9",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Warpflame projector",
      "range": "6\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Pyreflux meltagun",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Power claw and warpflame projector",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrate, Mark of Tzeentch, Unyielding",
    "Battle Protocols: Select one Battle Protocol during each activation:",
    "- Aegis: All models in the unit gain +1 Toughness. This is the default selection in the first battle round until the first actual activation.",
    "- Conqueror: All models in the unit gain +1 WS.",
    "- Protector: All models in the unit gain +1 BS."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [
    "Thousand Sons"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "Elites",
  "default_size": 2,
  "min_cost": 296
};
