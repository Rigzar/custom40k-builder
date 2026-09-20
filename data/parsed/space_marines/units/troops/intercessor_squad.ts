/**
 * INTERCESSOR SQUAD — Troops
 *
 * SOURCE: Codex/Space Marines 1.04.ods, sheet "Intercessor Squad". Verbatim:
 *
 *   4-9  Intercessor Marine            6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   38 pts
 *   1    Intercessor Sergeant          6" 3+ 3+ S4 T4 W2 I4 A2 Ld7 Sv3+   38 pts
 *   *    Veteran Intercessor Sergeant  6" 3+ 3+ S4 T4 W2 I4 A2 Ld8 Sv3+   48 pts
 *   Every model is equipped with: Bolt rifle; Bolt pistol; Frag grenades; Krak grenades.
 *
 *   Bolt pistol                 12"  Pistol 1      4  -1  1   -
 *   Bolt rifle *
 *   - Bolt ammo                 30"  Rapid Fire 1  4  -1  1   -
 *   - Stalker ammo              36"  Heavy 1       4  -2  1   -
 *   - Assault ammo              24"  Assault 2     4   0  1   -
 *   Frag grenade                 6"  Grenade 1     4   0  1   Blast(4)
 *   Heavy bolter                36"  Rapid Fire 2  5  -2  1   -
 *   Krak grenade                 6"  Grenade 1     6  -2  1   -
 *   Plasma incinerator *
 *   - Standard                  30"  Rapid Fire 1  7  -3  1   AT(1)
 *   - Overheating               30"  Rapid Fire 1  8  -4  2   AT(2), Overheating
 *   Pyreblaster                 12"  Assault 4     4   0  1   Auto Hit, Sunder(1)
 *   Pyrecannon                  15"  Assault 4     5  -1  1   Auto Hit, Sunder(1)
 *   Castellan missile launcher *
 *   - Castellan missile         36"  Assault 1     4  -1  1   Blast(4), Indirect
 *   - Krak missile              48"  Heavy 1       8  -3  2   AT(2), Anti-air
 *
 *   OPTIONS
 *   • For every 5 models, two Intercessor Marines may be equipped with:
 *     Grenade launcher +1
 *   • Alternatively, for every 5 models, two Intercessor Marines may swap their Bolt rifle:
 *     Pyreblaster +0 / Pyrecannon +7 / Heavy bolter +10 / Plasma incinerator +12 / Castellan missile launcher +32
 *   • The Intercessor Sergeant may be upgraded to a Veteran Intercessor Sergeant for +10 points
 *     and gains access to weapons and gear from the Armory.
 *
 *   ABILITIES: Combat squads, They Shall Know No Fear
 *              Grenade launcher: Grenades carried by the model gain a range of 24".
 *   UNIT TYPE: Infantry
 *
 * 1.03 -> 1.04: 37/37/47 -> 38/38/48, BOTH special-weapon groups go from one model per five to
 * two, and the swap list grows from Pyreblaster alone to five weapons. The new choices are
 * appended AFTER Pyreblaster because `optionQty` is keyed by choice index. The Pyrecannon,
 * added 2026-09-19, is appended for the same reason even though the sheet prints it second.
 *
 * ABILITY VOCABULARY: the sheet is written in the POST-clean-up names (Blast(4), Auto Hit +
 * Sunder(1)); stored here in the pre-clean-up vocabulary the rest of the app still uses
 * (Explosive, Flames), to be renamed with everything else when that lands atomically.
 */

import type { Unit } from '../../../../../src/types/data';

export const intercessorSquad: Unit = {
  "name": "Intercessor Squad",
  "models": [
    {
      "name": "Intercessor Marine",
      "points": 38,
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
      "points": 38,
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
      "points": 48,
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
  "equipped_with": "Every model is equipped with: Bolt rifle; Bolt pistol; Frag grenades; Krak grenades.",
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
      "abilities": "Blast(4)"
    },
    {
      "name": "Pyreblaster",
      "range": "12\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1)"
    },
    {
      "name": "Pyrecannon",
      "range": "15\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1)"
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma incinerator (Standard)",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma incinerator (Overheating)",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Castellan missile launcher (Castellan)",
      "range": "36\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Blast(4), Indirect"
    },
    {
      "name": "Castellan missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Bolt rifle (Bolt ammo)",
      "range": "30\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt rifle (Stalker ammo)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt rifle (Assault ammo)",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 5 models, two Intercessor Marines may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Grenade launcher",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Alternatively, for every 5 models, two Intercessor Marines may swap their Bolt rifle",
      "constraint": {
        "type": "per_n",
        "per_n": 5,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Pyreblaster",
          "points": 0
        },
        {
          "name": "Heavy bolter",
          "points": 10
        },
        {
          "name": "Plasma incinerator",
          "points": 12
        },
        {
          "name": "Castellan missile launcher",
          "points": 32
        },
        {
          "name": "Pyrecannon",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt rifle (Bolt ammo)", "Bolt rifle (Stalker ammo)", "Bolt rifle (Assault ammo)"]
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
    "Combat squads, They Shall Know No Fear",
    "Grenade launcher: Grenades carried by the model gain a range of 24\"."
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
  "min_cost": 190
};
