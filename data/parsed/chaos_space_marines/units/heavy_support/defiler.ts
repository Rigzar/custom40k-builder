/**
 * DEFILER — Heavy Support
 *
 * SOURCE: Chaos Space Marines 1.02.ods / "Defiler" — REWORKED in CSM 1.02 (2026-07-24).
 * ───────────────────────────────────────────────────────────────────────────
 * Base cost 419 -> 293. Base loadout changed from "Battle cannon; Defiler claws; Heavy flamer;
 * Reaper autocannon" to "Defiler claws; Ectoplasma destructor; 2 Power scourges" — the heavy
 * guns are now paid for as options instead of being included.
 *
 * PROFILE (unchanged):
 *   1  Defiler  6"  3+  3+  S6  FRONT 12  SIDE 12  REAR 10  I4  A3  HP3  — 293 pts
 *
 * EQUIPPED WITH: Defiler claws; Ectoplasma destructor; 2 Power scourges.
 *
 * OPTIONS (verbatim 1.02):
 *   • May receive a Mark of Chaos: K/N/S/T +10 each
 *   • May replace the Ectoplasma destructor: Battle cannon +115
 *   • May replace one Power scourge: Reaper autocannon +14 / Twin heavy bolter +19 /
 *     Missile launcher +24 / Twin lascannon +121
 *   • May replace the other Power scourge: Heavy baleflamer +9 / Twin heavy flamer +9 /
 *     Havoc launcher +13 / Reaper autocannon +14 / Twin lascannon +121
 *   • May be equipped with one of: Combi-flamer +8 / Combi-bolter +11 / Combi-melta +18 /
 *     Two Excruciator cannons +27 / Two Magma cutters +34
 *   • May have up to 2 veteran abilities · Has access to vehicle equipment from the Armory
 *
 * ABILITIES: — (none)
 * UNIT TYPE: Walker · KEYWORDS: Chaos Space Marine
 *
 * ENGINE NOTE: the .ods writes "AP(2)" in the ABILITIES column of Battle cannon and Ectoplasma
 * destructor; that is the author's long-standing typo for the Armour-Tear rule, recorded here as
 * AT(2) to match every other datasheet (same call as the v1.54 AP(x)->AT(x) sweep).
 * The two Power scourge swap groups are separate "one" groups so each scourge can be swapped
 * independently, exactly as the datasheet words it.
 */

import type { Unit } from '../../../../../src/types/data';

export const defiler: Unit = {
  "name": "Defiler",
  "models": [
    {
      "name": "Defiler",
      "points": 293,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Chaos Defiler is equipped with: Defiler claws; Ectoplasma destructor; 2 Power scourges.",
  "weapons": [
    {
      "name": "Defiler claws",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Ectoplasma destructor",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Power scourge",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(4)"
    },
    {
      "name": "Battle cannon",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage, Tank hunter"
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
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Heavy baleflamer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Twin heavy flamer",
      "range": "9\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Havoc launcher",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Explosive"
    },
    {
      "name": "Missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Combi-bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-flamer - Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Combi"
    },
    {
      "name": "Combi-flamer - Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Combi, Flames"
    },
    {
      "name": "Combi-melta - Bolter",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Combi"
    },
    {
      "name": "Combi-melta - Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Combi, Melta"
    },
    {
      "name": "Excruciator cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Magma cutter",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    }
  ],
  "option_groups": [
    {
      "header": "May receive a Mark of Chaos:",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 10
        },
        {
          "name": "Nurgle",
          "points": 10
        },
        {
          "name": "Slaanesh",
          "points": 10
        },
        {
          "name": "Tzeentch",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May replace the Ectoplasma destructor:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Battle cannon",
          "points": 115
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Ectoplasma destructor"
      ]
    },
    {
      "header": "May replace one Power scourge:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Reaper autocannon",
          "points": 14
        },
        {
          "name": "Twin heavy bolter",
          "points": 19
        },
        {
          "name": "Missile launcher",
          "points": 24
        },
        {
          "name": "Twin lascannon",
          "points": 121
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Power scourge"
      ]
    },
    {
      "header": "May replace the other Power scourge:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy baleflamer",
          "points": 9
        },
        {
          "name": "Twin heavy flamer",
          "points": 9
        },
        {
          "name": "Havoc launcher",
          "points": 13
        },
        {
          "name": "Reaper autocannon",
          "points": 14
        },
        {
          "name": "Twin lascannon",
          "points": 121
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Power scourge"
      ]
    },
    {
      "header": "May be equipped with one of the following:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Combi-flamer",
          "points": 8
        },
        {
          "name": "Combi-bolter",
          "points": 11
        },
        {
          "name": "Combi-melta",
          "points": 18
        },
        {
          "name": "Two Excruciator cannons",
          "points": 27
        },
        {
          "name": "Two Magma cutters",
          "points": 34
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
  "unit_type": "Walker",
  "keywords": [
    "Chaos Space Marine",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 293
};
