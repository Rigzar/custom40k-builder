/**
 * LORD DISCORDANT — HQ
 *
 * SOURCE: Chaos Space Marines ENG / Lord Discordant.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME             M     WS  BS  S  T  W  I  A  LD  SV   PTS
 *   1    Lord Discordant  12”   2+  2+  4  6  5  5  4   9  2+   170
 *
 * EQUIPPED WITH: A Lord Discordant is equipped with: Baleflamer; Bladed limbs;
 *   Impaler chainglaive; Frag grenades; Krak grenades.
 *   (HTML weapon-row header typo: “Imapaler chainglaive” — correct name is “Impaler chainglaive”)
 *
 * WEAPONS:
 *   Baleflamer                     12”  Assault 4   6  AP-2  D1  Flames                              [default]
 *   Bladed limbs                    —   Melee       6  AP-2  D1  Flurry(2)    [fixed S=6, not S+X]
 *   Frag grenade                   6”   Grenade 1   4  AP0   D1  Explosive
 *   Impaler chainglaive - Charge    —   Melee      x2  AP-3  D2  AT(2), Can only be used with a Charge order
 *   Impaler chainglaive - Melee     —   Melee      +2  AP-3  D1  —
 *   Krak grenade                   6”   Grenade 1   6  AP-2  D1  —
 *   Magma cutter                   12”  Pistol 1    8  AP-5  D2  AT(2), Melta  [option]
 *   Reaper autocannon              36”  Heavy 3     7  AP-2  D1  AT(1)         [option]
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Undivided+0 / K+8 / S+8 / N+30 / T+25
 *   • May replace its Baleflamer with: Reaper Autocannon +26
 *   • May be equipped with one of: Technovirus-Injector+10 / Magma cutter+26
 *   • Has armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Move through cover
 *   Technovirus-Injector: Melee attacks gain the “Tank hunter” ability.
 *
 * UNIT TYPE: Character model, Monstrous Creature
 * KEYWORDS: Chaos Space Marine
 *   (TS also has “Monster” — production semantic for is_monster: true)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly
 *   ✓ all 8 weapons match HTML exactly (dual Impaler profile + fixed S=6 on Bladed limbs) ✓
 *   ✓ marks: all 5 including Undivided+0 ✓
 *   ✓ Baleflamer replace option with replaces: [“Baleflamer”] ✓
 *   ✓ Technovirus-Injector/Magma cutter choose-one group ✓
 *   ✓ is_monster: true / is_character: true / has_armory_access: true / veteran_max: 2 ✓
 *   ✓ default_size: 1 / min_cost: 170 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const lordDiscordant: Unit = {
  "name": "Lord Discordant",
  "models": [
    {
      "name": "Lord Discordant",
      "points": 170,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "6",
        "W": "5",
        "I": "5",
        "A": "4",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Lord Discordant is equipped with: Baleflamer; Bladed limbs; Impaler chainglaive; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Baleflamer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Bladed limbs",
      "range": "-",
      "type": "Melee",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2)"
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
      "name": "Magma cutter",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Reaper autocannon",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Impaler chainglaive - Charge",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Can only be used with a Charge order"
    },
    {
      "name": "Impaler chainglaive - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
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
          "points": 30
        },
        {
          "name": "Tzeentch",
          "points": 25
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May replace its Baleflamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Reaper autocannon",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Baleflamer"
      ]
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Technovirus-Injector",
          "points": 10
        },
        {
          "name": "Magma cutter",
          "points": 26
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Move through cover",
    "Technovirus-Injector: Melee attacks gain the \"Tank hunter\" ability."
  ],
  "unit_type": "Character Model, Monstrous Creature",
  "keywords": [
    "Chaos Space Marine",
    "Monster"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": true,
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
  "min_cost": 170
};

