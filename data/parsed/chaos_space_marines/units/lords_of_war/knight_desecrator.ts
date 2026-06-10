/**
 * KNIGHT DESECRATOR — Lords of War
 *
 * SOURCE: Informacion/Escalation.ods, sheet "Knight Desecrator" (canonical datasheet —
 *   NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
 *   cross-faction Lords of War supplement, sheet "Knight Desecrator")
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME               M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Knight Desecrator  12"  3+  3+  7    13    12    12   4  3   4  547
 *
 * EQUIPPED WITH: A Knight Desecrator is equipped with: Heavy stubber; Knight melee
 *   weapon; Laser destructor.
 *
 * WEAPONS:
 *   Heavy stubber                  36"  Heavy 3  S4   AP 0  D1  Suppression
 *   Knight melee weapon - Strike    -   Melee    SD   AP-4  D3  AT(3)
 *   Knight melee weapon - Sweep     -   Melee    SU   AP-3  D2  AT(1), Flurry(3)
 *   Laser destructor               72"  Heavy 2  S10  AP-5  D3  AT(4), Tank hunter
 *
 * OPTIONS:
 *   • May receive a Mark of Chaos: Khorne/Nurgle/Slaanesh/Tzeentch +20 points (each)
 *
 * ABILITIES (verbatim):
 *   Ion shield: The model gains a 4+ invulnerability save against ranged attacks.
 *   During the activation, you have to select wether the Ion shield covers attacks
 *   from the front, the left side, the right side or the back. The default side is
 *   always the front.
 *
 * UNIT TYPE: Super-heavy Vehicle
 * KEYWORDS: Lord of War
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim
 *     (Knight melee weapon Strike/Sweep sub-profiles correctly split into separate
 *     "<weapon> - <profile>" entries, same convention used across CSM melee weapons
 *     with multiple profiles e.g. Power fist; the source's own typo "wether" in the
 *     Ion shield ability text is preserved verbatim — not corrected to "whether",
 *     correct per FAQ#5/golden-rule, canonical text stands even with typos)
 *   ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god — pricier
 *     than the standard +10 seen on CSM-native vehicles, consistent with Lord of
 *     War scale; this is the ONLY option on this datasheet — no weapon swaps)
 *   ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
 *   ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
 *     both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
 *     route) and "Vehicle" to the source's single "Lord of War" keyword; correct
 *     per the cross-faction supplement architecture — same pattern as Fellblade/Spartan
 *   ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
 *     min_cost: 547
 *   🟡 Ion shield is a text-only special rule (situational invulnerability save with
 *     a player-chosen facing) — no dedicated engine primitive for directional saves;
 *     consistent with the established "verbatim text, no mechanical simulation"
 *     treatment seen across CSM vehicles
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const knightDesecrator: Unit = {
  "name": "Knight Desecrator",
  "models": [
    {
      "name": "Knight Desecrator",
      "points": 547,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "12",
        "I": "4",
        "A": "3",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Knight Desecrator is equipped with: Heavy stubber; Knight melee weapon; Laser destructor.",
  "weapons": [
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Knight melee weapon - Strike",
      "range": "-",
      "type": "Melee",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Knight melee weapon - Sweep",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Flurry(3)"
    },
    {
      "name": "Laser destructor",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(4), Tank hunter"
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
    }
  ],
  "abilities": [
    "Ion shield: The model gains a 4+ invulnerability save against ranged attacks. During the activation, you have to select wether the Ion shield covers attacks from the front, the left side, the right side or the back. The default side is always the front."
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
  "min_cost": 547
};

