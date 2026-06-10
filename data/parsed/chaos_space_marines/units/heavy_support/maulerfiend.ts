/**
 * MAULERFIEND — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Maulerfiend.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME         M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Maulerfiend  6"   3+  3+  6    12    12    11   4  5   3  187
 *
 * EQUIPPED WITH: A Maulerfiend is a single model and equipped with: Lasher tendrils;
 *   Maulerfiend fists.
 *
 * WEAPONS:
 *   Lasher tendrils    -   Melee     SU   AP-2  D1  Flurry(4)
 *   Magma cutter      12"  Pistol 1  S8   AP-5  D2  AT(2), Melta
 *   Maulerfiend fists  -   Melee     Sx2  AP-3  D2  AT(2)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May replace its Lasher tendrils: two Magma cutters +17
 *   • Has access to vehicle equipment from the Armory
 *   • May have up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Move through cover
 *   Charge: The unit has a 12" Charge move.
 *
 * UNIT TYPE: Walker
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     structured replace (replaces:["Lasher tendrils"], two Magma cutters +17 — single
 *     choice list matching "May replace its Lasher tendrils")
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
 *   ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 187
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const maulerfiend: Unit = {
  "name": "Maulerfiend",
  "models": [
    {
      "name": "Maulerfiend",
      "points": 187,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "11",
        "I": "4",
        "A": "5",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Maulerfiend is a single model and equipped with: Lasher tendrils; Maulerfiend fists.",
  "weapons": [
    {
      "name": "Lasher tendrils",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(4)"
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
      "name": "Maulerfiend fists",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
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
      "header": "May replace its Lasher tendrils",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Magma cutters",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Lasher tendrils"
      ]
    }
  ],
  "abilities": [
    "Move through cover",
    "Charge: The unit has a 12\" Charge move."
  ],
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
  "min_cost": 187
};

