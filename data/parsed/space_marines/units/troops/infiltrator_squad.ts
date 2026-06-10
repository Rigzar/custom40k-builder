/**
 * INFILTRATOR SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Infiltrator Squad.html)
 * ─────────────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Infiltrator Marine      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 42 pts
 *   1    Infiltrator Sergeant    M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 42 pts
 *   *    Veteran Infiltrator Sgt M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 52 pts
 * EQUIPPED WITH: Every model: Bolt carbine; Bolt pistol; Combat knife; Frag grenades; Krak grenades; Smoke grenades.
 * WEAPONS:
 *   Bolt carbine  24" Rapid Fire 1 S:4  AP:-1 D:1  Seeking   (NOTE: has Seeking — different from Indomitus Bolt carbine)
 *   Bolt pistol   12" Pistol 1     S:4  AP:-1 D:1  -
 *   Combat knife   -  Melee        S:U  AP:0  D:1  -
 *   Frag grenade   6" Grenade 1    S:4  AP:0  D:1  Explosive
 *   Krak grenade   6" Grenade 1    S:6  AP:-2 D:1  -
 * OPTIONS:
 *   For each 5 models: Haywire mine+10 and/or Omni scrambler+10
 *   For each 5 models: one Infiltrator Marine → Helix Adept +5 pts
 *   Infiltrator Sergeant → Veteran Infiltrator Sergeant +10 pts + armory.
 * ABILITIES:
 *   Infiltrator, Move through cover, They Shall Know No Fear
 *   Helix Adept: once/turn reduce damage of a wound by 1; doesn't apply to S:8+.
 *   Haywire mine: once/battle, place while moving; 1D3+1 wounds S:4 AP:-4 D:1 to first unit in 3".
 *   Smoke grenades: once/game, gain "Deflect" ability during activation or when targeted.
 *   Omni scrambler: icons/homing beacons don't function within 6"; deepstrike within 12" scatters 4D6.
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. Bolt carbine has Seeking ✓ (Indomitus variant has no Seeking).
 *   champion_has_armory:true (vet upgrade grants armory). Haywire/Omni per_n modeling noted.
 */

import type { Unit } from '../../../../../src/types/data';

export const infiltratorSquad: Unit = {
  "name": "Infiltrator Squad",
  "models": [
    {
      "name": "Infiltrator Marine",
      "points": 42,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    },
    {
      "name": "Infiltrator Sergeant",
      "points": 42,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
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
      "name": "Veteran Infiltrator Sergeant",
      "points": 52,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Bolt carbine; Bolt pistol; Combat knife; Frag grenades; Krak grenades; Smoke grenades.",
  "weapons": [
    {
      "name": "Bolt carbine",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Seeking"
    },
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
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Combat knife",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
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
      "header": "For each 5 models, the unit may pick any or all of this",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Haywire mine",
          "points": 10
        },
        {
          "name": "Omni scrambler",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each 5 models, one Infiltrator Marine may be upgraded to a Helix Adept for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The Infiltrator Sergeant may be upgraded to a Veteran Infiltrator Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Infiltrator Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Move through cover, They Shall Know No Fear",
    "Helix Adept: Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above.",
    "Haywire mine: Once per battle, this unit can place an Haywire mine while moving. This must be placed within 1\" of the unit and more than 3\" away from enemy units. The first enemy unit that come within 3\" of the Haywire mine suffers 1D3+1 wounds with Strength: 4, AP: -4, D: 1. Vehicles suffer 1D3 glancing hits.",
    "Smoke grenades: The unit can use its Smoke grenades once per game:\n- During normal activation.\n- If it has not yet carried out its order this round and is targeted by an enemy unit.\nThe unit gains the \"Deflect\" ability.",
    "Omni scrambler: Equipment such as icons or homing beacons do not function within 6\" of the model. Additionally, units arriving via deepstrike that land within 12\" roll 4D6 instead of 2D6 for scattering."
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 210
};
