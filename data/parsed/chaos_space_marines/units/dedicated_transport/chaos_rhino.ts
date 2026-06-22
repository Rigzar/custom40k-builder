/**
 * CHAOS RHINO — Dedicated Transport
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Rhino.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME         M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Chaos Rhino  12"   -  3+  5    11    11    10   4  1   2  111
 *
 * EQUIPPED WITH: A Rhino is equipped with: Combi bolter.
 *
 * WEAPONS:
 *   Combi-bolter            24"  Rapid fire 2  S4  AP-1  D1  -
 *   Combi-flamer - Bolter   24"  Rapid fire 1  S4  AP-1  D1  -
 *   Combi-flamer - Flamer    9"  Assault 4     S4  AP 0  D1  Flames
 *   Combi-melta - Bolter    24"  Rapid fire 1  S4  AP-1  D1  -
 *   Combi-melta - Melta     12"  Assault 1     S8  AP-5  D1  AT(1), Melta
 *   Havoc launcher          48"  Heavy 1       S5  AP-1  D1  Anti-Air, Explosive
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
 *     Combi-melta +18
 *   • May be equipped with a Havoc launcher for +29pts
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Fire hatches(2)
 *   Transport: This model has a transport capacity of 10 infantry models, excluding
 *   models in Terminator armor.
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (combi-weapon
 *     sub-profiles correctly split into separate "<weapon> - <profile>" entries, same
 *     convention as Land Raider/Predator/Defiler)
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     additive combi-weapon pick (+8/+11/+18) / "one" inline_pts:29 Havoc launcher add
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
 *   ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
 *     single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 111
 *   🟡 Transport(10)/Fire hatches text-only — no transport-capacity primitive on the
 *     engine side (same gap class noted on Land Raider; consistent treatment, not a
 *     unique bug here)
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosRhino: Unit = {
  "name": "Chaos Rhino",
  "models": [
    {
      "name": "Chaos Rhino",
      "points": 111,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Rhino is equipped with: Combi-bolter.",
  "weapons": [
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
      "name": "Havoc launcher",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Explosive"
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
      "header": "May be equipped with a Havoc launcher for +29pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Havoc launcher",
          "points": 29
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Fire hatches(2)",
    "Transport: This model has a transport capacity of 10 infantry models, excluding models in Terminator armor."
  ],
  "unit_type": "Vehicle",
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 111
};

