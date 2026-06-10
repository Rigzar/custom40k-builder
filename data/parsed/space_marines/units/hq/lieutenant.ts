/**
 * LIEUTENANT — HQ
 *
 * SOURCE (canonical — Space Marines ENG/Lieutenant.html)
 * ──────────────────────────────────────────────────────
 * PROFILE:
 *   1 Lieutenant M:6" WS:2+ BS:2+ S:4 T:4 W:4 I:5 A:2 LD:8 SV:3+ — 79 pts
 *   * Captain    M:6" WS:2+ BS:2+ S:4 T:4 W:4 I:5 A:3 LD:9 SV:3+ — 94 pts
 * EQUIPPED WITH: Frag grenades; Krak grenades.
 * WEAPONS:
 *   Frag grenade  6"  Grenade 1  S:4  AP:0  D:1  Explosive
 *   Krak grenade  6"  Grenade 1  S:6  AP:-2 D:1  -
 * OPTIONS:
 *   One Lieutenant per army can be upgraded to a Captain for +15 points.
 *   Has access to weapons and gear from the Armory.
 *   Can gain one Veteran ability.
 * ABILITIES:
 *   They Shall Know No Fear
 *   Combat Tactics: assigns 1 free Vet ability at deployment (self + 1 friendly unit, same ability).
 *   Captain: may use Combat Tactics a second time.
 * UNIT TYPE: Character model, Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. Captain upgrade via variant_link correct.
 *   Validator checks Captain variant for "only one Captain or Captain Dreadnought per army" rule.
 */

import type { Unit } from '../../../../../src/types/data';

export const lieutenant: Unit = {
  "name": "Lieutenant",
  "models": [
    {
      "name": "Lieutenant",
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
      "name": "Captain",
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
  "equipped_with": "A Lieutenant is equipped with: Frag grenades; Krak grenades.",
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
      "header": "One Lieutenant per army can be upgraded to a Captain for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Captain",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "They Shall Know No Fear",
    "Combat Tactics: The Lieutenant can assign a free Veteran ability to himself and a friendly unit at the start of the deployment. Both units must be able to gain the Veteran ability and it must be the same ability. It does not count against the limit on how many Veteran abilities a unit can have.",
    "Captain: A Captain may use Combat Tactics a second time."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
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
  "min_cost": 79
};
