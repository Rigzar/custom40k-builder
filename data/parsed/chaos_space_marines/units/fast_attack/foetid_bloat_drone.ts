/**
 * FOETID BLOAT-DRONE — Fast Attack
 *
 * SOURCE: Chaos Space Marines ENG / Foetid Bloat-Drone.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1-2  Foetid Bloat-Drone  12"   -  3+  5    11    11    10   4  1   2  136
 *
 * EQUIPPED WITH: A Foetid Bloat-Drone is equipped with: Fleshmower; Plague probe.
 *
 * WEAPONS:
 *   Fleshmower             -    Melee      S+2  AP-2  D1  AT(1), Deflagrate(5+), Poison(4+), Flurry(4)
 *   Heavy blight launcher 36"  Assault 1  S7   AP-3  D2  Armorbane, AT(1), Explosive, Poison(4+)
 *   Plague probe           -    Melee      SU   AP-2  D1  Poison(4+)
 *   Plague spewer          9"  Assault 4  S5   AP-1  D1  Flames, Poison(4+)
 *
 * OPTIONS:
 *   • Can replace the Fleshmower with: Two plague spewers +41 / Heavy blight launcher +74
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim):
 *   Anti-Grav, Fast, Mark of Nurgle, Squadron
 *   Fleshmower: The model gains WS 3+ if it starts the game with this weapon.
 *   Pest explosion: If the Foetid Bloat-Drone is destroyed, it always explodes.
 *     The explosion range is 6".
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Death Guard
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim
 *   ✓ option_groups: "one" with replaces:["Fleshmower"] (structured replace)
 *   ✓ locked_mark: "Nurgle" (from "Mark of Nurgle" ability — locked, no mark choice offered)
 *   🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
 *     to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
 *     from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
 *     equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
 *     category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
 *     it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
 *     `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
 *     note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
 *     after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
 *   ✓ keywords: ["Death Guard", "Vehicle"] — "Vehicle" appended to the source's single
 *     "Death Guard" keyword, consistent with the vehicle-keyword convention used faction-wide
 *   ✓ is_vehicle: true / unit_type: "Vehicle" / default_size: 1 / min_cost: 136
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const foetidBloatDrone: Unit = {
  "name": "Foetid Bloat-Drone",
  "models": [
    {
      "name": "Foetid Bloat-Drone",
      "points": 136,
      "min": 1,
      "max": 2,
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
  "equipped_with": "A Foetid Bloat-Drone is equipped with: Fleshmower; Plague probe.",
  "weapons": [
    {
      "name": "Fleshmower",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Deflagrate(5+), Poison(4+), Flurry(4)"
    },
    {
      "name": "Heavy blight launcher",
      "range": "36\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "Armorbane, AT(1), Explosive, Poison(4+)"
    },
    {
      "name": "Plague probe",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Plague spewer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Fleshmower",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Two plague spewers",
          "points": 41
        },
        {
          "name": "Heavy blight launcher",
          "points": 74
        }
      ],
      "replaces": [
        "Fleshmower"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Mark of Nurgle, Squadron",
    "Fleshmower: The model gains WS 3+ if it starts the game with this weapon.",
    "Pest explosion: If the Foetid Bloat-Drone is destroyed, it always explodes. The explosion range is 6\"."
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
  "min_cost": 136
};

