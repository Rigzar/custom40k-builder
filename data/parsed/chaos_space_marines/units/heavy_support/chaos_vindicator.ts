/**
 * CHAOS VINDICATOR — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Chaos Vindicator.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME              M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Chaos Vindicator  12"   -  3+  6    13    11    10   4  1   3  373
 *
 * EQUIPPED WITH: A Chaos Vindicator is equipped with: Demolisher cannon.
 *
 * WEAPONS:
 *   Combi-bolter            24"  Rapid fire 2  S4   AP-1  D1  -
 *   Combi-flamer - Bolter   24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-flamer - Flamer    9"  Assault 4     S4   AP 0  D1  Flames
 *   Combi-melta - Bolter    24"  Rapid fire 1  S4   AP-1  D1  -
 *   Combi-melta - Melta     12"  Assault 1     S8   AP-5  D1  AT(1), Melta
 *   Demolisher cannon       24"  Heavy 1       S10  AP-4  D3  AT(4), Barrage, Tank hunter
 *   Havoc launcher          48"  Heavy 1       S5   AP-1  D1  Anti-Air, Explosive
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May be equipped with one of the following: Combi-flamer +8 / Combi-bolter +11 /
 *     Combi-melta +18
 *   • May be equipped with a Havoc launcher for +29pts
 *   • May be equipped with a Siege shield for +15 points
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Siege shield: The model automatically passes tests for difficult terrain and is
 *   not slowed down by it. Additionally, attacks from the front always treat the
 *   Vindicator as being in cover.
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (combi-weapon
 *     sub-profiles correctly split, same convention as Chaos Predator/Land Raider)
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     additive combi-weapon pick (+8/+11/+18) / "one" inline_pts:29 Havoc launcher add /
 *     "one" inline_pts:15 Siege shield add
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
 *   🟡 "Siege shield" appears BOTH as a purchasable +15pt option AND as a verbatim
 *     ABILITIES entry describing what it does — prod JSON correctly lists it in
 *     `abilities` (canonical rules text describing the wargear's effect) while ALSO
 *     gating it behind the option pick; this is the source's own structure, not a bug
 *   ✓ keywords: ["Chaos Space Marine", "Vehicle"] — "Vehicle" appended to the source's
 *     single "Chaos Space Marine" keyword, consistent with the vehicle-keyword convention
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 373
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosVindicator: Unit = {
  "name": "Chaos Vindicator",
  "models": [
    {
      "name": "Chaos Vindicator",
      "points": 373,
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
  "equipped_with": "A Chaos Vindicator is equipped with: Demolisher cannon.",
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
      "name": "Demolisher cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4), Barrage, Tank hunter"
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
      "choices": [],
      "inline_pts": 29,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with a Siege shield for +15 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Siege shield: The model automatically passes tests for difficult terrain and is not slowed down by it. Additionally, attacks from the front always treat the Vindicator as being in cover."
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
  "min_cost": 373
};

