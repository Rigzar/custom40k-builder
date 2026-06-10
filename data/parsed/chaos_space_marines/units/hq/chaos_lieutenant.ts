/**
 * CHAOS LIEUTENANT — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Lieutenant.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME              M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   1    Chaos Lieutenant  6"   2+  2+  4  4  4  5  2   8  3+    79
 *   *    Chaos Lord        6"   2+  2+  4  4  4  5  3   9  3+    94  [upgrade]
 *
 * EQUIPPED WITH: A Chaos Lieutenant is equipped with: Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Frag grenade  6"  Grenade 1  4  AP0   D1  Explosive
 *   Krak grenade  6"  Grenade 1  6  AP-2  D1  —
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+20 / T+15
 *   • One Chaos Lieutenant per army can be upgraded to a Chaos Lord for +15 points
 *   • Has armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Veterans of the Long War: The Chaos Lieutenant can assign a free Veteran ability to
 *     himself and a friendly unit at the start of the deployment. Both units must be able
 *     to gain the veteran ability and it must be the same ability. It does not count
 *     against the limit on how many veteran abilities a unit can have.
 *   Chaos Lord: A Chaos Lord may use Veterans of the Long War a second time.
 *
 * UNIT TYPE: Character model, Infantry
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (base + Chaos Lord variant)
 *   ✓ weapons: 2 grenades match HTML exactly
 *   ✓ marks: all 5 including Undivided+0 ✓
 *   ✓ variant_link: "Chaos Lord", is_unique_per_army: true ✓
 *   ✓ abilities text verbatim match ✓
 *   ✓ is_character: true / has_armory_access: true / veteran_max: 2 ✓
 *   ✓ default_size: 1 / min_cost: 79 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosLieutenant: Unit = {
  "name": "Chaos Lieutenant",
  "models": [
    {
      "name": "Chaos Lieutenant",
      "points": 79,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
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
      "name": "Chaos Lord",
      "points": 94,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
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
  "equipped_with": "A Chaos Lieutenant is equipped with: Frag grenades; Krak grenades.",
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
      "header": "One Chaos Lieutenant per army can be upgraded to a Chaos Lord for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Chaos Lord",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Veterans of the Long War: The Chaos Lieutenant can assign a free Veteran ability to himself and a friendly unit at the start of the deployment. Both units must be able to gain the veteran ability and it must be the same ability. It does not count against the limit on how many veteran abilities a unit can have.",
    "Chaos Lord: A Chaos Lord may use Veterans of the Long War a second time."
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
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 79
};
