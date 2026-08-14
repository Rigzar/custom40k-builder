/**
 * PLAGUEBURST CRAWLER — Heavy Support
 *
 * SOURCE: Chaos Space Marines ENG / Plagueburst Crawler.html (canonical datasheet)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME                  M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Plagueburst Crawler  12"   -   3+  7    13    12    11   4  2   3  324
 *
 * EQUIPPED WITH: A Plagueburst Crawler is equipped with: Plagueburst mortar;
 *   two Plague spewers; Rothail volley gun.
 *
 * WEAPONS:
 *   Entropy cannon - Focused entropy  48"  Heavy 1       S8  AP-5  D3  AT(3)
 *   Entropy cannon - Entropic burst   48"  Heavy 1       S5  AP-1  D1  Explosive, Poison(4+)
 *   Heavy slugger                     36"  Heavy 3       S5  AP-1  D1  -
 *   Plagueburst mortar                48"  Heavy 1       S7  AP-3  D2  AT(1), Barrage,
 *                                                                       Indirect, Poison(4+)
 *   Plague spewer                      9"  Assault 4     S5  AP-1  D1  Flames, Poison(4+)
 *   Rothail volley gun                24"  Rapid Fire 2  S6  AP-2  D1  Poison(4+)
 *
 * OPTIONS (verbatim header "OPTIONEN" — German typo in source spreadsheet, preserved
 *   only as a structural label, not copied into prod JSON option_group headers):
 *   • Can replace the Rothail volley gun: Heavy slugger +5
 *   • Can replace two Plague spewers: two Entropy cannons +27
 *   • Has access to vehicle equipment from the Armory
 *
 * ABILITIES (verbatim): Mark of Nurgle
 *
 * UNIT TYPE: Vehicle
 * KEYWORDS: Death Guard
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match HTML verbatim (Entropy cannon
 *     Focused entropy/Entropic burst sub-profiles correctly split into separate
 *     "<weapon> - <profile>" entries, same convention as Predator/PBC's own listing order)
 *   ✓ option_groups: "one" structured replace (replaces:["Rothail volley gun"], Heavy
 *     slugger +5) / "one" structured replace (replaces:["Plague spewer"], two Entropy
 *     cannons +27)
 *   🔴 has_armory_access: false — CORRECTED 2026-06-07 (was true). Verbatim text reads "Has access
 *     to vehicle equipment from the Armory" — a DISTINCT, narrower grant than "weapons and gear
 *     from the Armory" (the phrase used on CSM characters like Sorcerer/Dark Apostle). "Vehicle
 *     equipment" = the Vehicle Upgrades list ONLY, already shown automatically via is_vehicle +
 *     category:'vehicle' items (UnitCard.tsx hasFactionVehicleItems — independent of this flag);
 *     it does NOT grant the general armory (Daemon weapon/Daemonic armor/Familiar/etc.). The old
 *     `true` value wrongly opened that general armory tab. (This session's earlier SOURCE-pass
 *     note "vehicle equipment only" assumed the flag itself was vehicle-scoped — it isn't; fixed
 *     after cross-referencing engine code + verbatim text comparison across all CSM vehicles.)
 *   ✓ has_veteran_abilities: false (no veteran-ability line in source — unlike most
 *     CSM Heavy Support vehicles, this datasheet has none)
 *   ✓ locked_mark: "Nurgle" — sourced from the dedicated "Mark of Nurgle" ABILITIES
 *     row (this is a Death Guard unit with a baked-in mark, not a purchasable option;
 *     correctly modeled as a lock rather than an option_group choice)
 *   ✓ unit_type: "Vehicle" / keywords: ["Death Guard", "Vehicle"] — "Vehicle" appended
 *     to the source's single "Death Guard" keyword, consistent with vehicle convention
 *   ✓ is_vehicle: true / default_size: 1 / min_cost: 324
 *   🟡 source's own OPTIONS section header reads "OPTIONEN" (German for "options" —
 *     a copy-paste artefact in the spreadsheet); cosmetic, has no bearing on data
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const plagueburstCrawler: Unit = {
  "name": "Plagueburst Crawler",
  "models": [
    {
      "name": "Plagueburst Crawler",
      "points": 324,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "7",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "11",
        "I": "4",
        "A": "2",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Plagueburst Crawler is equipped with: Plagueburst mortar; two Plague spewers; Rothail volley gun.",
  "weapons": [
    {
      "name": "Heavy slugger",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plagueburst mortar",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Barrage, Indirect, Poison(4+)"
    },
    {
      "name": "Plague spewer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    },
    {
      "name": "Rothail volley gun",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Entropy cannon - Focused entropy",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Entropy cannon - Entropic burst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Poison(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Rothail volley gun:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy slugger",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Rothail volley gun"
      ]
    },
    {
      "header": "Can replace two Plague spewers:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Entropy cannons",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Plague spewer"
      ]
    }
  ],
  "abilities": [
    "Mark of Nurgle"
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 324
};

