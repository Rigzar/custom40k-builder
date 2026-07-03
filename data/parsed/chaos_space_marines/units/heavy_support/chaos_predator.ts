/**
 * CHAOS PREDATOR — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Predator.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME      M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Predator  12"   -  3+  6    13    11    10   4  1   3  232
 *
 * EQUIPPED WITH: A Predator is equipped with: Predator autocannon.
 *
 * WEAPONS:
 *   Combi-bolter            24"  Rapid fire 2  S4   AP-1  D1  -
 *   Combi-flamer - Bolter   24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
 *   Combi-melta - Bolter    24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive
 *   Heavy bolter            36"  Rapid Fire 2  S5   AP-2  D1  -
 *   Lascannon               48"  Heavy 1       S9   AP-4  D3  AT(3)
 *   Predator autocannon     48"  Heavy 3       S7   AP-3  D2  Armor piercing(5+), AT(1)
 *   Twin entropy cannon - Focused entropy  48"  Heavy 2  S8  AP-5  D3  AT(3)
 *   Twin entropy cannon - Entropic burst   48"  Heavy 2  S5  AP-1  D1  Explosive, Poison(4+)
 *   Twin lascannon          48"  Heavy 2       S9   AP-4  D3  AT(3)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May replace the Predator autocannon: Twin entropy cannon (Nurgle only) +50 /
 *     Twin lascannon +50
 *   • May be equipped with one of the following: two Heavy bolters +54 / two lascannons +138
 *   • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
 *     Combi-melta +18
 *   • May be equipped with a Havoc launcher for +29pts
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim): -
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options match HTML verbatim (combi-weapon and twin entropy
 *     cannon sub-profiles correctly split into separate "<weapon> - <profile>" entries,
 *     same convention as Chaos Land Raider/Chaos Bikers)
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     structured replace (replaces:["Predator autocannon"], Twin entropy cannon
 *     [Nurgle only — text-only restriction, no enforced gate] / Twin lascannon, both +50) /
 *     "one" additive sponson pick (two Heavy bolters +54 / two lascannons +138) / "one"
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
 *   ✓ abilities: [] (source ABILITIES row is "-" — no abilities listed)
 *   ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
 *     single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 232
 *   🟡 "Twin entropy cannon (Nurgle only)" restriction is text-only in source — engine
 *     does not enforce a Mark-of-Nurgle prerequisite for this replace choice (same class
 *     of soft-restriction gap seen elsewhere; not a data bug, the choice/points are correct)
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosPredator: Unit = {
  "name": "Chaos Predator",
  "models": [
    {
      "name": "Predator",
      "points": 232,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Predator is equipped with: Predator autocannon.",
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Predator autocannon",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), AT(1)"
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
    },
    {
      "name": "Twin entropy cannon - Focused entropy",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin entropy cannon - Entropic burst",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Poison(4+)"
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
      "header": "May replace the Predator autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin entropy cannon",
          "points": 50
        },
        {
          "name": "Twin lascannon",
          "points": 50
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Predator autocannon"
      ]
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Heavy bolters",
          "points": 54
        },
        {
          "name": "two lascannons",
          "points": 138
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
  "abilities": [],
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
  "min_cost": 232
};

