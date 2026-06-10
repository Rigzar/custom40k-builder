/**
 * LORD OF SKULLS — Lords of War
 *
 * SOURCE: Informacion/Escalation.ods, sheet "Lord of Skulls" (canonical datasheet —
 *   NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
 *   cross-faction Lords of War supplement, sheet "Lord of Skulls")
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME            M    WS  BS  S   FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Lord of Skulls  12"  3+  3+  10    13    13    11   4  4   5  680
 *
 * EQUIPPED WITH: A Lord of Skulls is equipped with: Great cleaver of Khorne; Hades
 *   gatling cannon; Ichor cannon.
 *
 * WEAPONS:
 *   Daemongore cannon                15"  Heavy 4   S9   AP-3  D3  AT(3), Flames, Overheating
 *   Gorestorm cannon                 15"  Heavy 6   S8   AP-3  D2  AT(2), Flames
 *   Great cleaver of Khorne - Strike  -   Melee     SD   AP-4  D3  AT(5)
 *   Great cleaver of Khorne - Sweep   -   Melee     SU   AP-3  D2  AT(3), Flurry(3)
 *   Hades gatling cannon             48"  Heavy 12  S8   AP-3  D1  AT(2), Suppression
 *   Ichor cannon                     48"  Heavy 1   S7   AP-4  D1  AT(1), Barrage, Seeking
 *   Skullhurler                      60"  Heavy 1   S9   AP-4  D2  AT(3), Colossal blast
 *
 * OPTIONS:
 *   • May swap the Ichor cannon: Gorestorm cannon +49 / Daemongore cannon +61
 *   • May swap the Hades gatling cannon: Skullhurler +171
 *
 * ABILITIES (verbatim): Mark of Khorne
 *
 * UNIT TYPE: Super-heavy Vehicle
 * KEYWORDS: Lord of War
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options all match the .ods sheet verbatim (Great Cleaver
 *     of Khorne Strike/Sweep sub-profiles correctly split into separate
 *     "<weapon> - <profile>" entries, same convention as the Knight datasheets)
 *   ✓ option_groups: TWO "one" structured replace groups — "May swap the Ichor cannon"
 *     (replaces:["Ichor cannon"], choices Gorestorm cannon +49 / Daemongore cannon +61)
 *     and "May swap the Hades gatling cannon" (replaces:["Hades gatling cannon"],
 *     choice Skullhurler +171) — both correctly modeled as optional single-target swaps
 *   ✓ locked_mark: "Khorne" — derived from the bare ABILITIES-section text "Mark of
 *     Khorne" (the source datasheet's entire ABILITIES line is just this one mark
 *     name, with no other compound rule text alongside it — DIFFERENT from Plagueburst
 *     Crawler/Miasmic Malignifier where "Mark of Nurgle" appears as part of a larger
 *     multi-rule ABILITIES block; here the mark consumes the whole field, correctly
 *     leaving abilities:[] empty rather than storing "Mark of Khorne" as a freestanding
 *     ability string)
 *   ✓ has_armory_access: false / has_veteran_abilities: false / no Mark-of-Chaos
 *     option_group (the mark is locked, not purchasable — consistent with how
 *     locked_mark units across CSM omit the "May receive a Mark of Chaos" picker)
 *   ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
 *     both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
 *     route) and "Vehicle" to the source's single "Lord of War" keyword; correct
 *     per the cross-faction supplement architecture — same pattern as the other 5 LoW units
 *   ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
 *     min_cost: 680 (no mandatory paid options — both swaps are optional single-picks)
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const lordOfSkulls: Unit = {
  "name": "Lord of Skulls",
  "models": [
    {
      "name": "Lord of Skulls",
      "points": 680,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "10",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "11",
        "I": "4",
        "A": "4",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Lord of Skulls is equipped with: Great cleaver of Khorne; Hades gatling cannon; Ichor cannon.",
  "weapons": [
    {
      "name": "Daemongore cannon",
      "range": "15\"",
      "type": "Heavy 4",
      "s": "9",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Flames, Overheating"
    },
    {
      "name": "Gorestorm cannon",
      "range": "15\"",
      "type": "Heavy 6",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flames"
    },
    {
      "name": "Great cleaver of Khorne - Strike",
      "range": "-",
      "type": "Melee",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(5)"
    },
    {
      "name": "Great cleaver of Khorne - Sweep",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Flurry(3)"
    },
    {
      "name": "Hades gatling cannon",
      "range": "48\"",
      "type": "Heavy 12",
      "s": "8",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(2), Suppression"
    },
    {
      "name": "Ichor cannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-4",
      "d": "1",
      "abilities": "AT(1), Barrage, Seeking"
    },
    {
      "name": "Skullhurler",
      "range": "60\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Colossal blast"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Ichor cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gorestorm cannon",
          "points": 49
        },
        {
          "name": "Daemongore cannon",
          "points": 61
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Ichor cannon"
      ]
    },
    {
      "header": "May swap the Hades gatling cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Skullhurler",
          "points": 171
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Hades gatling cannon"
      ]
    }
  ],
  "abilities": [],
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
  "locked_mark": "Khorne",
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 680
};

