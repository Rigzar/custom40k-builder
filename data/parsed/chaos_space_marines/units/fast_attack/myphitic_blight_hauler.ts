/**
 * MYPHITIC BLIGHT-HAULER — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Myphitic Blight-Hauler.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                    M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1-2  Myphitic Blight-Hauler  12"  3+  3+  5    11    11    10   4  2   2  174
 *
 * EQUIPPED WITH: A Myphitic Blight-Hauler is equipped with: Gnashing maw;
 *   Missile launcher; Multi-melta.
 *
 * WEAPONS:
 *   Bile spurt                       9"  Assault 4  S6   AP-1  D1  Flames, Poison(4+)
 *   Gnashing maw                     -   Melee      S+1  AP-2  D1  -
 *   Multi-melta                     24"  Assault 1  S8   AP-5  D2  AT(2), Melta
 *   Missile launcher - Frag missile 48"  Heavy 1    S4   AP 0  D1  Explosive
 *   Missile launcher - Krak missile 48"  Heavy 1    S8   AP-3  D2  Anti-Air, AT(2)
 *
 * OPTIONS:
 *   • May be equipped with Bile spurt for +19 points
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Mark of Nurgle, Squadron
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Death Guard
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "one" inline_pts:19 add (Bile spurt — additive, not a replace)
 *   🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
 *     to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
 *     from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
 *     equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
 *     category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
 *     it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
 *     `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
 *     note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
 *     after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
 *   ✓ locked_mark: "Nurgle" (from "Mark of Nurgle" ability — locked, no mark choice offered)
 *   ✓ keywords: ["Death Guard", "Vehicle"] — "Vehicle" appended to the source's single
 *     "Death Guard" keyword, consistent with the vehicle-keyword convention used faction-wide
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 174
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const myphiticBlightHauler: Unit = {
  "name": "Myphitic Blight-Hauler",
  "models": [
    {
      "name": "Myphitic Blight-Hauler",
      "points": 174,
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
        "A": "2",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Myphitic Blight-Hauler is equipped with: Gnashing maw; Missile launcher; Multi-melta.",
  "weapons": [
    {
      "name": "Bile spurt",
      "range": "9\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    },
    {
      "name": "Gnashing maw",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Missile launcher - Frag missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Missile launcher - Krak missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with Bile spurt for +19 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 19,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Mark of Nurgle, Squadron"
  ],
  "unit_type": "Vehicle",
  "keywords": [
    "Death Guard",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 174
};

