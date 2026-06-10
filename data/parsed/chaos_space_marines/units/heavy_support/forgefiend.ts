/**
 * FORGEFIEND — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Forgefiend.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME        M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Forgefiend  6"   3+  3+  6    12    12    10   3  1   3  269
 *
 * EQUIPPED WITH: A Forgefiend is equipped with: two Hades autocannons.
 *
 * WEAPONS:
 *   Ectoplasma gun     36"  Heavy 2  S8  AP-4  D2  AT(2)
 *   Hades autocannon   36"  Heavy 4  S8  AP-2  D1  AT(2), Suppression
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May replace the two Hades autocannon: two Ectoplasma guns +21
 *   • May be equipped with an additional Ectoplasma gun for +75pts
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim): -
 *
 * UNIT TYPE: Walker
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god) / "one"
 *     structured replace (replaces:["Hades autocannon"], two Ectoplasma guns +21 —
 *     single choice list matching "May replace the two Hades autocannon") / "one"
 *     inline_pts:75 additional Ectoplasma gun add
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
 *   ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 269
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const forgefiend: Unit = {
  "name": "Forgefiend",
  "models": [
    {
      "name": "Forgefiend",
      "points": 269,
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
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Forgefiend is equipped with: two Hades autocannons.",
  "weapons": [
    {
      "name": "Ectoplasma gun",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Hades autocannon",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2), Suppression"
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
      "header": "May replace the two Hades autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Ectoplasma guns",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Hades autocannon"
      ]
    },
    {
      "header": "May be equipped with an additional Ectoplasma gun for +75pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 75,
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
  "min_cost": 269
};

