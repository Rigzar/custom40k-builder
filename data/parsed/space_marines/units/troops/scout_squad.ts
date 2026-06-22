/**
 * SCOUT SQUAD — Troops
 *
 * SOURCE (canonical — Space Marines ENG/Scout Squad.html)
 * ───────────────────────────────────────────────────────
 * PROFILES:
 *   4-9  Scout          M:6" WS:4+ BS:4+ S:4 T:4 W:1 I:4 A:2 LD:6 SV:4+ — 15 pts
 *   1    Scout Sergeant M:6" WS:3+ BS:3+ S:4 T:4 W:2 I:4 A:2 LD:8 SV:4+ — 35 pts
 * EQUIPPED WITH: Every model: Bolt pistol; Combat knife; Frag grenades; Krak grenades.
 * WEAPONS:
 *   Combat knife             -   Melee        S:U  AP:0  D:1  -
 *   Astartes shotgun        18" Assault 2     S:4  AP:0  D:1  -
 *   Bolt pistol             12" Pistol 1      S:4  AP:-1 D:1  -
 *   Boltgun                 24" Rapid Fire 1  S:4  AP:-1 D:1  -
 *   Sniper rifle            36" Heavy 1       S:5  AP:-2 D:2  Armor piercing(5+), Suppression
 *   Heavy bolter            36" Rapid Fire 2  S:5  AP:-2 D:1  -
 *   Missile launcher (Frag) 48" Heavy 1       S:4  AP:0  D:1  Explosive
 *   Missile launcher (Krak) 48" Heavy 1       S:8  AP:-3 D:2  AT(2), Anti-air
 *   Frag grenade             6" Grenade 1     S:4  AP:0  D:1  Explosive
 *   Krak grenade             6" Grenade 1     S:6  AP:-2 D:1  -
 * OPTIONS:
 *   Every Scout may swap their Combat knife: Astartes shotgun+2, Boltgun+2, Sniper rifle+16
 *   One Scout may swap their Combat knife: Heavy bolter+11, Missile launcher+28
 *   Whole squad: Camo cloaks +11 pts/model
 *   Scout Sergeant has direct armory access (no upgrade required).
 * ABILITIES:
 *   Combat squads, Infiltrator, They Shall Know No Fear
 *   Camo cloak: The model gains the "Stealth" ability.
 *   Sniper: A model with Sniper rifle improves BS by +1.
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS: ✓ all data matches HTML. has_armory_access:true (Sergeant direct, no vet upgrade).
 */

import type { Unit } from '../../../../../src/types/data';

export const scoutSquad: Unit = {
  "name": "Scout Squad",
  "models": [
    {
      "name": "Scout",
      "points": 15,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "4",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Scout Sergeant",
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
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bolt pistol; Combat knife; Frag grenades; Krak grenades.",
  "weapons": [
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
      "name": "Astartes shotgun",
      "range": "18\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Boltgun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
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
    },
    {
      "name": "Sniper rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Every Scout may swap their Combat knife",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Astartes shotgun",
          "points": 2
        },
        {
          "name": "Boltgun",
          "points": 2
        },
        {
          "name": "Sniper rifle",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combat knife"]
    },
    {
      "header": "One Scout may swap their Combat knife",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 11
        },
        {
          "name": "Missile launcher",
          "points": 28
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Combat knife"]
    },
    {
      "header": "The whole squad may be equipped with Camo cloaks for +11 points per model.",
      "constraint": {
        "type": "every"
      },
      "choices": [],
      "inline_pts": 11,
      "per_model": true,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat squads, Infiltrator, They Shall Know No Fear",
    "Camo cloak: The model gains the \"Stealth\" ability.",
    "Sniper: A model equipped with a Sniper rifle improves its BS by +1."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 95
};
