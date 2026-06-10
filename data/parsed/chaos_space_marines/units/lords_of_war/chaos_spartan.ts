/**
 * CHAOS SPARTAN — Lords of War
 *
 * SOURCE: Informacion/Escalation.ods, sheet "Chaos Spartan" (canonical datasheet —
 *   NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
 *   cross-faction Lords of War supplement, sheet "Chaos Spartan")
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME           M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Chaos Spartan  12"   -  3+  6    14    14    14   4  1   5  641
 *
 * EQUIPPED WITH: A Chaos Spartan is equipped with: 2 Laser destroyers; Twin heavy flamer.
 *
 * WEAPONS:
 *   Combi-bolter        24"  Rapid fire 2  S4   AP-1  D1  -
 *   Heavy bolter        36"  Heavy 3       S5   AP-2  D1  -
 *   Heavy flamer         9"  Assault 4     S5   AP-1  D1  Flames
 *   Laser destroyer     72"  Heavy 1       S10  AP-6  D4  AT(4), Lance(1), Tank hunter
 *   Multi-melta         24"  Heavy 1       S8   AP-5  D2  AT(2), Melta
 *   Quad lascannon      48"  Heavy 4       S9   AP-4  D3  AP(3)
 *   Storm bolter        24"  Assault 2     S4   AP-1  D1  -
 *   Twin heavy bolter   36"  Heavy 6       S5   AP-2  D1  -
 *   Twin heavy flamer    9"  Assault 8     S5   AP-1  D1  Flames
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)
 *   • May swap their Twin heavy flamer: Twin heavy bolter +10
 *   • May swap their 2 Laser destroyers: 2 Quad lascannons +272
 *   • Can be equipped with one of the following: Storm bolter +11 / Heavy flamer +13 /
 *     Heavy bolter +18 / Multi-melta +35
 *
 * ABILITIES (verbatim):
 *   Assault ramp: Passengers can still make a 6" charge move after the vehicle moves
 *   and they exit.
 *   Transport: This model has a transport capacity of 25 infantry models.
 *
 * UNIT TYPE: Super-heavy Vehicle
 * KEYWORDS: Lord of War
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim
 *     (note this datasheet has no sub-profile weapons, unlike the Fellblade)
 *   ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god) / "one"
 *     structured replace (replaces:["Twin heavy flamer"], Twin heavy bolter +10) /
 *     "one" structured replace (replaces:["Laser destroyer"], 2 Quad lascannons +272)
 *     / "one" additive weapon pick (+11/+13/+18/+35) — identical OPTIONS block to
 *     the Chaos Fellblade (sister datasheet sharing the same supplement template)
 *   ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
 *   ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
 *     both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
 *     route) and "Vehicle" to the source's single "Lord of War" keyword; correct
 *     per the cross-faction supplement architecture (canonical sheet is faction-
 *     neutral; per-faction copy adds the faction keyword) — same pattern as Fellblade
 *   ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
 *     min_cost: 641
 *   🟡 Assault ramp/Transport(25) text-only — no transport-capacity primitive on the
 *     engine side (same gap class as Land Raider/Chaos Rhino/Dreadclaw; consistent
 *     treatment, not a unique bug here)
 *   🟡 source sheet has a duplicate "KEYWORDS" header row (rows 22 and 24, with row 23
 *     containing only "-") — a copy-paste artefact in the spreadsheet; the actual
 *     keyword value "Lord of War" appears once and is correctly extracted
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const chaosSpartan: Unit = {
  "name": "Chaos Spartan",
  "models": [
    {
      "name": "Chaos Spartan",
      "points": 641,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "4",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Chaos Spartan is equipped with: 2 Laser destroyers; Twin heavy flamer.",
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
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Laser destroyer",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "4",
      "abilities": "AT(4), Lance(1), Tank hunter"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Quad lascannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AP(3)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin heavy flamer",
      "range": "9\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
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
          "points": 20
        },
        {
          "name": "Nurgle",
          "points": 20
        },
        {
          "name": "Slaanesh",
          "points": 20
        },
        {
          "name": "Tzeentch",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap their Twin heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin heavy bolter",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Twin heavy flamer"
      ]
    },
    {
      "header": "May swap their 2 Laser destroyers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Quad lascannons",
          "points": 272
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Laser destroyer"
      ]
    },
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 11
        },
        {
          "name": "Heavy flamer",
          "points": 13
        },
        {
          "name": "Heavy bolter",
          "points": 18
        },
        {
          "name": "Multi-melta",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Assault ramp: Passengers can still make a 6\" charge move after the vehicle moves and they exit.",
    "Transport: This model has a transport capacity of 25 infantry models."
  ],
  "unit_type": "Super-heavy Vehicle",
  "keywords": [
    "Chaos Space Marine",
    "Lord of War",
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
  "advisor": false,
  "locked_mark": null,
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 641
};

