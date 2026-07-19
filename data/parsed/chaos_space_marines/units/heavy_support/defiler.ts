/**
 * DEFILER — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Defiler.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME     M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Defiler  6"   3+  3+  6    12    12    10   4  3   3  419
 *
 * EQUIPPED WITH: A Chaos Defiler is equipped with: Battle cannon; Defiler claws;
 *   Heavy flamer; Reaper Autocannon.
 *
 * WEAPONS:
 *   Battle cannon           72"  Heavy 1       S8   AP-3  D2  AP(2), Barrage, Tank hunter
 *   Combi-bolter            24"  Rapid fire 2  S4   AP-1  D1  -
 *   Combi-flamer - Bolter   24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
 *   Combi-melta - Bolter    24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Defiler claws            -   Melee         Sx2  AP-3  D2  AT(2)
 *   Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive
 *   Heavy flamer             9"  Heavy 4       S5   AP-1  D1  Flames
 *   Power scourge            -   Melee         SU   AP-2  D1  Flurry(4)
 *   Reaper autocannon       36"  Heavy 3       S7   AP-2  D1  AT(1)
 *   Twin heavy bolter       36"  Rapid Fire 4  S5   AP-2  D1  -
 *   Twin lascannon          48"  Heavy 2       S9   AP-4  D3  AT(3)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
 *     Combi-melta +18
 *   • May replace the Heavy flamer: Power scourge +4 / Havoc launcher +20
 *   • May replace the Reaper autocannon: Twin heavy bolter +0 / Twin lascannon +107
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim): -
 *
 * UNIT TYPE: Walker
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options match HTML verbatim (combi-weapon sub-profiles
 *     correctly split, same convention as Predator/Vindicator/Land Raider)
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     additive combi-weapon pick (+8/+11/+18) / "one" structured replace
 *     (replaces:["Heavy flamer"], Power scourge +4 / Havoc launcher +20) / "one"
 *     structured replace (replaces:["Reaper autocannon"], Twin heavy bolter +0 free
 *     swap / Twin lascannon +107)
 *   ✓ has_veteran_abilities: true / veteran_max: 2
 *   🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
 *     to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
 *     from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
 *     equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
 *     category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
 *     it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
 *     `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
 *     note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
 *     after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
 *   ✓ abilities: [] (source ABILITIES row is "-" — no abilities listed)
 *   ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
 *     single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
 *   ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 419
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const defiler: Unit = {
  "name": "Defiler",
  "models": [
    {
      "name": "Defiler",
      "points": 419,
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
  "equipped_with": "A Chaos Defiler is equipped with: Battle cannon; Defiler claws; Heavy flamer; Reaper Autocannon.",
  "weapons": [
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
      "name": "Combi-bolter",
      "range": "24\"",
      "type": "Rapid fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
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
      "name": "Havoc launcher",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Explosive"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Combi-flamer - Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-flamer - Flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Combi-melta - Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Combi-melta - Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
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
      "header": "May be equipped with one of the following",
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
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May replace the Heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Power scourge",
          "points": 4
        },
        {
          "name": "Havoc launcher",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Heavy flamer"
      ]
    },
    {
      "header": "May replace the Reaper autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin heavy bolter",
          "points": 0
        },
        {
          "name": "Twin lascannon",
          "points": 107
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Reaper autocannon"
      ]
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
  "min_cost": 419
};

