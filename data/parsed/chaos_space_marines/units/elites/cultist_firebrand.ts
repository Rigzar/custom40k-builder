/**
 * CULTIST FIREBRAND — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Cultist Firebrand.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME               M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1    Cultist Firebrand  6"   4+  4+  3  3  2  3  1   7  5+   39
 *
 * EQUIPPED WITH: A Cultist Firebrand is equipped with: Baleflamer; Frag grenades.
 *
 * WEAPONS:
 *   Baleflamer     12"  Assault 4  S6  AP-2  D1  Flames
 *   Frag grenade    6"  Grenade 1  S4  AP 0  D1  Explosive
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos:
 *     Undivided +0 / Khorne +8 / Slaanesh +8 / Nurgle +20 / Tzeentch +15
 *   • Slot-exempt rule: "For each Cultists unit, one Cultist Firebrand unit may
 *     be selected that does not occupy an Elite slot."
 *   • Has access to weapons and gear from the Armory.
 *
 * ABILITIES (verbatim): — (none listed on datasheet)
 *
 * UNIT TYPE: Character model, Infantry
 * KEYWORDS: Cultist
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML exactly
 *   ✓ mark options: Undivided+0 / K+8 / S+8 / N+20 / T+15
 *   ✓ has_armory_access: true (single-model character — whole unit has armory)
 *   ✓ champion_has_armory: false (correct — no separate champion model)
 *   ✓ is_character: true
 *   ✓ slot-exempt rule as text-only option_group (constraint:"one", choices:[])
 *   ✓ abilities: [] — HTML shows "-"
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const cultistFirebrand: Unit = {
  "name": "Cultist Firebrand",
  "models": [
    {
      "name": "Cultist Firebrand",
      "points": 39,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Cultist Firebrand is equipped with: Baleflamer; Frag grenades.",
  "weapons": [
    {
      "name": "Baleflamer",
      "range": "12\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
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
          "name": "Undivided",
          "points": 0
        },
        {
          "name": "Khorne",
          "points": 8
        },
        {
          "name": "Slaanesh",
          "points": 8
        },
        {
          "name": "Nurgle",
          "points": 20
        },
        {
          "name": "Tzeentch",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each Cultists unit, one Cultist Firebrand unit may be selected that does not occupy an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Cultist"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 39
};
