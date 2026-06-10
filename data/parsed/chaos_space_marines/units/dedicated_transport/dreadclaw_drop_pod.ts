/**
 * DREADCLAW DROP POD — Dedicated Transport
 *
 * SOURCE: Chaos Space Marines ENG / Dreadclaw Drop Pod.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Dreadclaw Drop Pod  12"  4+  4+  5    11    11    11   4  4   2  154
 *
 * EQUIPPED WITH: A Dreadclaw Drop Pod is equipped with: Blade struts; Thermal jets.
 *
 * WEAPONS:
 *   Blade struts   -   Melee     SU  AP-2  D1  -
 *   Thermal jets  9"  Assault 4  S6  AP-2  D1  Flames
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Anti-Grav, Deep strike
 *   Control Jets: The Drop Pod must land at least 6" away from other units (friendly
 *   or enemy) and can never stray closer than 1" to another unit, terrain, or the edge
 *   of the field. Reduce the deviation only enough to place the Drop Pod.
 *   Drop Pod Assault: Drop Pods always start the game as reserves and are always set
 *   up via Deep strike. Even if the played mission does not allow reinforcements
 *   and/or Deep strike!
 *   Transport: This model has a transport capacity of 10 models or 1 Helbrute.
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god — no weapon
 *     swap groups; this datasheet has none)
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
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 154
 *   🟡 Anti-Grav/Control Jets/Drop Pod Assault/Transport(10 or 1 Helbrute) all text-only
 *     — no deep-strike-restriction or transport-capacity primitives on the engine side
 *     (same gap class as Land Raider/Chaos Rhino; consistent treatment)
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const dreadclawDropPod: Unit = {
  "name": "Dreadclaw Drop Pod",
  "models": [
    {
      "name": "Dreadclaw Drop Pod",
      "points": 154,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "4",
        "A": "4",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dreadclaw Drop Pod is equipped with: Blade struts; Thermal jets.",
  "weapons": [
    {
      "name": "Blade struts",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Thermal jets",
      "range": "9\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
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
    }
  ],
  "abilities": [
    "Anti-Grav, Deep strike",
    "Control Jets: The Drop Pod must land at least 6\" away from other units (friendly or enemy) and can never stray closer than 1\" to another unit, terrain, or the edge of the field. Reduce the deviation only enough to place the Drop Pod.",
    "Drop Pod Assault: Drop Pods always start the game as reserves and are always set up via Deep strike. Even if the played mission does not allow reinforcements and/or Deep strike!",
    "Transport: This model has a transport capacity of 10 models or 1 Helbrute."
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
  "min_cost": 154
};

