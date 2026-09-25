/**
 * ERADICATOR SQUAD — Heavy Support
 *
 * SOURCE (canonical — Space Marines ENG/Eradicator Squad.html)
 * ────────────────────────────────────────────────────────────────────
 * PROFILES:
 *   2-5  Eradicator Marine       M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 53 pts
 *   1    Eradicator Sergeant     M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 53 pts
 *   *    Veteran Eradicator Sgt  M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:8 SV:3+ — 63 pts
 *   (Gravis armour; T:5.)
 * EQUIPPED WITH: Every model: Melta rifle; Bolt pistol; Frag grenades; Gravis armor; Krak grenades.
 * WEAPONS:
 *   Bolt pistol         12" Pistol 1  S:4 AP:-1 D:1 -
 *   Heavy bolter        36" Rapid Fire 2 S:5 AP:-2 D:1 -
 *   Heavy melta rifle   18" Assault 1 S:8 AP:-5 D:2 AT(2), Melta
 *   Melta rifle         18" Assault 1 S:8 AP:-5 D:1 AT(1), Melta
 *   Multi-melta         24" Assault 1 S:8 AP:-5 D:2 AT(2), Melta
 * OPTIONS:
 *   For every 3 models, one Marine may swap Melta rifle: Multi-melta +19
 *   All remaining models may swap Melta rifle: Heavy bolter +0 / Heavy melta rifle +18
 *   Eradicator Sergeant → Veteran Eradicator Sergeant +10 pts + armory.
 * ABILITIES:
 *   Combat squads, Massive(1), They Shall Know No Fear, Unyielding
 *   Gravis armor: The model gains a 6+ ward save.
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS (audited 2026-09-24): ✓ all data matches sheet exactly — no changes needed.
 *   armourKeyword:"Gravis" ✓. champion_has_armory:true (vet upgrade grants armory).
 *   default_size:3 (2 Marines + 1 Sergeant) / min_cost:159 (3×53) ✓.
 */

import type { Unit } from '../../../../../src/types/data';

export const eradicatorSquad: Unit = {
  "name": "Eradicator Squad",
  "models": [
    {
      "name": "Eradicator Marine",
      "points": 53,
      "min": 2,
      "max": 5,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Eradicator Sergeant",
      "points": 53,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
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
      "name": "Veteran Eradicator Sergeant",
      "points": 63,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Melta rifle, Bolt pistol; Frag grenades; Gravis armor; Krak grenades.",
  "armourKeyword": "Gravis",
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
      "name": "Melta rifle",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Heavy melta rifle",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    }
  ],
  "option_groups": [
    {
      "header": "For every three models, one Eradicator Marine may swap their Melta rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Multi-melta",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Melta rifle"]
    },
    {
      "header": "All remaining models may swap their Melta rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy melta rifle",
          "points": 18
        },
        {
          "name": "Heavy bolter",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Melta rifle"]
    },
    {
      "header": "The Eradicator Sergeant may be upgraded to a Veteran Eradicator Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Eradicator Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, Massive(1), They Shall Know No Fear, Unyielding",
    "Gravis armor: The model gains a 6+ ward save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 3,
  "min_cost": 159
};
