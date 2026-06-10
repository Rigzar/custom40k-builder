/**
 * INFERNAL ACOLYTE — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Infernal Acolyte.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME              M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   1    Infernal Acolyte  6"   3+  3+  4  4  4  5  2   8  3+    92
 *   *    Infernal Master   6"   3+  3+  4  4  4  5  3   9  3+   107  [upgrade]
 *
 * EQUIPPED WITH: An Infernal Acolyte is a single model equipped with: Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Frag grenade  6"  Grenade 1  4  AP0   D1  Explosive
 *   Krak grenade  6"  Grenade 1  6  AP-2  D1  —
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
 *   • One Infernal Acolyte per army can be upgraded to an Infernal Master for +15 points
 *   • Has armory access; up to 1 veteran ability
 *
 * ABILITIES (verbatim):
 *   Infernal Pact: An Infernal Acolyte may attempt to make one pact per activation.
 *     A pact is successful on a 3+. An Infernal Acolyte knows all Infernal Pacts.
 *   Infernal Master: An Infernal Master may attempt to make one additional pact each activation.
 *
 * UNIT TYPE: Character model, Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (base + Infernal Master variant)
 *   ✓ weapons: 2 grenades match HTML exactly
 *   ✓ marks: all 5 including Undivided+0 ✓
 *   ✓ variant_link: "Infernal Master", is_unique_per_army: true ✓
 *   ✓ abilities text verbatim match ✓
 *   ✓ veteran_max: 1 (HTML: "up to 1 veteran ability") ✓
 *   ✓ uses_pacts: true (production semantic) ✓
 *   ✓ is_character: true / has_armory_access: true ✓
 *   ✓ default_size: 1 / min_cost: 92 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const infernalAcolyte: Unit = {
  "name": "Infernal Acolyte",
  "models": [
    {
      "name": "Infernal Acolyte",
      "points": 92,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
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
      "name": "Infernal Master",
      "points": 107,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
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
  "equipped_with": "An Infernal Acolyte is a single model equipped with: Frag grenades; Krak grenades.",
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
      "header": "One Infernal Acolyte per army can be upgraded to an Infernal Master for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Infernal Master",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Infernal Pact: An Infernal Acolyte may attempt to make one pact per activation. A pact is successful on a 3+. An Infernal Acolyte knows all Infernal Pacts.",
    "Infernal Master: An Infernal Master may attempt to make one additional pact each activation."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 92,
  "uses_pacts": true
};
