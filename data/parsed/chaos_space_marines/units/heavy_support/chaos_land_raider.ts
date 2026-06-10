/**
 * CHAOS LAND RAIDER — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Land Raider.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME               M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Chaos Land Raider  12"   -  3+  7    14    14    14   4  1   4  558
 *
 * EQUIPPED WITH: A Chaos Land Raider is equipped with: Twin heavy bolter; 2 Twin Lascannons.
 *
 * WEAPONS:
 *   Combi-bolter            24"  Rapid fire 2  S4   AP-1  D1  -
 *   Combi-flamer - Bolter   24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
 *   Combi-melta - Bolter    24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive
 *   Twin heavy bolter       36"  Rapid Fire 4  S5   AP-2  D1  -
 *   Twin lascannon          48"  Heavy 2       S9   AP-4  D3  AT(3)
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
 *   Assault Ramp: Passengers may perform a Charge command, even if the vehicle
 *   moved up to 12".
 *   Transport: This model has a transport capacity of 10 infantry models.
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (combi-weapon
 *     sub-profiles correctly split into separate "<combi> - <profile>" weapon entries,
 *     same convention as Chaos Bikers)
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     additive combi-weapon pick (Combi-flamer/-bolter/-melta — bonus weapon, no
 *     `replaces`, matches "May be equipped with" not "may swap") / "one" inline_pts:29
 *     Havoc launcher add
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
 *   ✓ Transport (capacity 10 infantry) + Assault Ramp text-only (no transport-capacity
 *     primitive in engine — same class of gap as other transports, e.g. Chaos Rhino)
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 558
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosLandRaider: Unit = {
  "name": "Chaos Land Raider",
  "models": [
    {
      "name": "Chaos Land Raider",
      "points": 558,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "7",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "4",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Chaos Land Raider is equipped with: Twin heavy bolter; 2 Twin Lascannons.",
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
      "header": "May be equipped with a Havoc launcher for +29pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 29,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Assault Ramp: Passengers may perform a Charge command, even if the vehicle moved up to 12\".",
    "Transport: This model has a transport capacity of 10 infantry models."
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 558
};

