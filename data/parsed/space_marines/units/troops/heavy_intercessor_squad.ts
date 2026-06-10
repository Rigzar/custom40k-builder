/**
 * HEAVY INTERCESSOR SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Heavy Intercessor Squad.html)
 * ────────────────────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Intercessor Marine      M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 44 pts
 *   1    Intercessor Sergeant    M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:7 SV:3+ — 44 pts
 *   *    Veteran Intercessor Sgt M:6" WS:3+ BS:3+ S:4 T:5 W:2 I:4 A:2 LD:8 SV:3+ — 54 pts
 *   (NOTE: T:5 — not T:4 like regular Intercessors; Gravis armour.)
 * EQUIPPED WITH: Every model: Heavy bolt rifle; Bolt pistol; Frag grenades; Gravis armor; Krak grenades.
 * WEAPONS:
 *   Bolt pistol                   12" Pistol 1     S:4  AP:-1 D:1  -
 *   Heavy bolt rifle (Bolt ammo)  30" Rapid Fire 1 S:5  AP:-1 D:1  -
 *   Heavy bolt rifle (Stalker)    36" Heavy 1      S:5  AP:-2 D:1  -
 *   Heavy bolt rifle (Assault)    24" Assault 2    S:5  AP:0  D:1  -
 *   Heavy bolter (Bolt ammo)      36" Rapid Fire 2 S:5  AP:-2 D:1  -
 *   Heavy bolter (Stalker ammo)   42" Heavy 2      S:5  AP:-3 D:1  -
 *   Heavy bolter (Assault ammo)   30" Assault 4    S:5  AP:-1 D:1  -
 *   Frag grenade                   6" Grenade 1    S:4  AP:0  D:1  Explosive
 *   Krak grenade                   6" Grenade 1    S:6  AP:-2 D:1  -
 * OPTIONS:
 *   For every 5 models, one Marine may swap Heavy bolt rifle: Heavy bolter +15
 *   Intercessor Sergeant → Veteran Intercessor Sergeant +10 pts + armory.
 * ABILITIES:
 *   Combat squads, Massive(1), They Shall Know No Fear, Unyielding
 *   Gravis armor: The model gains a 6+ invulnerability save.
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. armourKeyword:"Gravis" ✓. T:5 ✓.
 *   champion_has_armory:true (vet upgrade grants armory).
 */

import type { Unit } from '../../../../../src/types/data';

export const heavyIntercessorSquad: Unit = {
  "name": "Heavy Intercessor Squad",
  "models": [
    {
      "name": "Intercessor Marine",
      "points": 44,
      "min": 4,
      "max": 9,
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
      "name": "Intercessor Sergeant",
      "points": 44,
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
      "name": "Veteran Intercessor Sergeant",
      "points": 54,
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
  "equipped_with": "Every model is equipped with: Heavy bolt rifle; Bolt pistol; Frag grenades; Gravis armor; Krak grenades.",
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
      "name": "Heavy bolter (Bolt ammo)",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy bolter (Stalker ammo)",
      "range": "42\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy bolter (Assault ammo)",
      "range": "30\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy bolt rifle (Bolt ammo)",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy bolt rifle (Stalker ammo)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy bolt rifle (Assault ammo)",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, one Intercessor Marine may swap their Heavy bolt rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
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
    "Combat squads, Massive(1), They Shall Know No Fear, Unyielding",
    "Gravis armor: The model gains a 6+ invulnerability save."
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
  "min_cost": 220
};
