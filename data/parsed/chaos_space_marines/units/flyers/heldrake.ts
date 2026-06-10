/**
 * HELDRAKE — Flyers
 *
 * SOURCE: Chaos Space Marines ENG / Heldrake.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME      M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Heldrake  12"  3+  3+  6    12    12    10   4  3   3  240
 *
 * EQUIPPED WITH: A Heldrake is a single model and equipped with: Bale flamer; Heldrake claws.
 *
 * WEAPONS:
 *   Baleflamer        12"  Assault 6  S6   AP-2  D1  Flames
 *   Heldrake claws     -   Melee      S+1  AP-3  D2  AT(1), Anti-air, Armorbane
 *   Hades autocannon  36"  Heavy 4    S8   AP-2  D1  AT(2), Suppression
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May replace its Baleflamer with: Hades autocannon +44
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Anti-Grav, Fast, Hover mode
 *   Vector strike: Each enemy unit which is passed by this model suffers 1D6
 *   automatic hits with the model's melee weapon.
 *
 * UNIT TYPE: Flyer, Vehicle
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (header text says
 *     "Bale flamer" with a space; the weapon-table row spells it "Baleflamer" — prod JSON
 *     follows the table-row spelling, the canonical weapon profile name)
 *   ✓ option_groups: "mark" (flat unit-level pick, +10pts uniform per god — single-model
 *     unit, no "per model"/"all models" qualifier) / "one" structured replace
 *     (replaces:["Baleflamer"], Hades autocannon +44)
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
 *   ✓ unit_type: "Flyer, Vehicle" / keywords: ["Chaos Space Marine", "Vehicle"] —
 *     "Vehicle" appended to the source's single "Chaos Space Marine" keyword
 *   ✓ is_vehicle: true / default_size: 1 / min_cost: 240
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const heldrake: Unit = {
  "name": "Heldrake",
  "models": [
    {
      "name": "Heldrake",
      "points": 240,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
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
  "equipped_with": "A Heldrake is a single model and equipped with: Bale flamer; Heldrake claws.",
  "weapons": [
    {
      "name": "Baleflamer",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heldrake claws",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Anti-air, Armorbane"
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
      "header": "May replace its Baleflamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hades autocannon",
          "points": 44
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Baleflamer"
      ]
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Hover mode",
    "Vector strike: Each enemy unit which is passed by this model suffers 1D6 automatic hits with the model's melee weapon."
  ],
  "unit_type": "Flyer, Vehicle",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 240
};

