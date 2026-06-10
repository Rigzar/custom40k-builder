/**
 * VENOMCRAWLER — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Venomcrawler.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME          M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1-2  Venomcrawler  12"  3+  3+  5    11    11    10   4  3   2  156
 *
 * EQUIPPED WITH: A Venomcrawler is equipped with: 2 Excruciator cannons, Soulflayer tendrils.
 *
 * WEAPONS:
 *   Excruciator cannon   36"  Assault 2  S7   AP-3  D1  AT(1)
 *   Soulflayer tendrils   -   Melee      S+2  AP-2  D2  AT(1), Flurry(2)
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +10 points (each)
 *   • May have up to 2 veteran abilities
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Move through cover, Squadron
 *   Soul-shredding Explosion: If the Venomcrawler is destroyed, it explodes
 *   automatically with a 6" radius.
 *
 * UNIT TYPE: Walker
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "mark" (flat unit-level pick — uniform +10pts per god, unlike the
 *     per-model mark groups on Infantry/Bike units; matches "May receive a Mark of Chaos"
 *     phrasing with no "per model"/"all models" qualifier)
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
 *   ✓ is_vehicle: true / unit_type: "Walker" / default_size: 1 / min_cost: 156
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const venomcrawler: Unit = {
  "name": "Venomcrawler",
  "models": [
    {
      "name": "Venomcrawler",
      "points": 156,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Venomcrawler is equipped with: 2 Excruciator cannons, Soulflayer tendrils.",
  "weapons": [
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
      "name": "Soulflayer tendrils",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Flurry(2)"
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
    "Move through cover, Squadron",
    "Soul-shredding Explosion: If the Venomcrawler is destroyed, it explodes automatically with a 6\" radius."
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 156
};

