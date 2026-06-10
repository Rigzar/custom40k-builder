/**
 * CHAPLAIN — HQ
 *
 * SOURCE (canonical — Space Marines ENG/Chaplain.html)
 * ──────────────────────────────────────────────────
 * PROFILE:
 *   1 Chaplain          M:6" WS:2+ BS:3+ S:4 T:4 W:4 I:5 A:2 LD:8 SV:3+ — 131 pts
 *   * Master of Sanctity M:6" WS:2+ BS:3+ S:4 T:4 W:4 I:5 A:3 LD:9 SV:3+ — 146 pts
 * EQUIPPED WITH: Crozius Arcanum; Frag grenades; Krak grenades.
 * WEAPONS:
 *   Frag grenade   6"  Grenade 1  S:4  AP:0  D:1  Explosive
 *   Krak grenade   6"  Grenade 1  S:6  AP:-2 D:1  -
 *   Crozius Arcanum  - Melee      S:+2 AP:-2 D:2  -
 * OPTIONS:
 *   One Chaplain per army can be upgraded to a Master of Sanctity for +15 points.
 *   Only one Master of Sanctity or Chaplain Dreadnought per army.
 *   Has access to weapons and gear from the Armory.
 *   Can gain one Veteran ability.
 * ABILITIES:
 *   They Shall Know No Fear
 *   Faithful: recite 1 prayer/round on 3+; knows all prayers of a selected list.
 *   Master of Sanctity: recite 1 additional prayer per turn.
 *   Rosarius: 4+ inv save.
 * UNIT TYPE: Character model, Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. is_priest:true correct (Faithful ability).
 */

import type { Unit } from '../../../../../src/types/data';

export const chaplain: Unit = {
  "name": "Chaplain",
  "models": [
    {
      "name": "Chaplain",
      "points": 131,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
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
      "name": "Master of Sanctity",
      "points": 146,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
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
  "equipped_with": "A Chaplain is equipped with: Crozius Arcanum; Frag grenades; Krak grenades.",
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
      "name": "Crozius Arcanum",
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
      "header": "One Chaplain per army can be upgraded to a Master of Sanctity for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Master of Sanctity",
      "is_unique_per_army": true
    },
    {
      "header": "Only one Master of Sanctity or Chaplain Dreadnought per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "They Shall Know No Fear",
    "Faithful: Can recite 1 prayer per round. A prayer is successfully recited on a roll of 3+. Knows all prayers of a selected list.",
    "Master of Sanctity: A Master of Sanctity may recite 1 additional prayer per turn.",
    "Rosarius: The model receives a 4+ invulnerability save."
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
  "min_cost": 131,
  "is_priest": true
};
