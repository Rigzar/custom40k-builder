/**
 * ASSAULT INTERCESSOR SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Assault Intercessor Squad.html)
 * ───────────────────────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Intercessor Marine      M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 35 pts
 *   1    Intercessor Sergeant    M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:7 SV:3+ — 35 pts
 *   *    Veteran Intercessor Sgt M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:3+ — 45 pts
 * EQUIPPED WITH: Every model: Astartes chainsword; Frag grenades; Heavy bolt pistol; Krak grenades.
 * WEAPONS:
 *   Astartes chainsword  -   Melee    S:U  AP:-1 D:1  -
 *   Heavy bolt pistol   12" Pistol 1  S:4  AP:-2 D:1  -
 *   Frag grenade         6" Grenade 1 S:4  AP:0  D:1  Explosive
 *   Krak grenade         6" Grenade 1 S:6  AP:-2 D:1  -
 * OPTIONS:
 *   Intercessor Sergeant → Veteran Intercessor Sergeant +10 pts + armory.
 *   No weapon options for the squad.
 * ABILITIES: Combat squads, They Shall Know No Fear
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. champion_has_armory:true (vet upgrade grants armory).
 */

import type { Unit } from '../../../../../src/types/data';

export const assaultIntercessorSquad: Unit = {
  "name": "Assault Intercessor Squad",
  "models": [
    {
      "name": "Intercessor Marine",
      "points": 35,
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
      "name": "Intercessor Sergeant",
      "points": 35,
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
      "name": "Veteran Intercessor Sergeant",
      "points": 45,
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
  "equipped_with": "Every model is equipped with: Astartes chainsword; Frag grenades; Heavy bolt pistol; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
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
      "name": "Heavy bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-2",
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
      "header": "The Intercessor Sergeant may be upgraded to a Veteran Intercessor Sergeant for +10 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Veteran Intercessor Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, They Shall Know No Fear"
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
  "min_cost": 175
};
