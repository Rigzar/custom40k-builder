/**
 * KNIGHT RAMPAGER — Lords of War
 *
 * SOURCE: Informacion/Escalation.ods, sheet "Knight Rampager" (canonical datasheet —
 *   NOT in the Chaos Space Marines ENG HTML folder; this unit comes from the Escalation
 *   cross-faction Lords of War supplement, sheet "Knight Rampager")
 * ───────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.  NAME              M    WS  BS  S  FRONT  SIDE  REAR  I  A  HP  PTS
 *   1    Knight Rampager   12"  3+  3+  7    13    12    12   4  3   4  385
 *
 * EQUIPPED WITH: A Knight Rampager is equipped with: Heavy stubber; 2 Knight melee
 *   weapons.
 *
 * WEAPONS:
 *   Heavy stubber                  36"  Heavy 3  S4   AP 0  D1  Suppression
 *   Knight melee weapon - Strike    -   Melee    SD   AP-4  D3  AT(3)
 *   Knight melee weapon - Sweep     -   Melee    SU   AP-3  D2  AT(1), Flurry(3)
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
 *   ✓ stats, pts, weapons, options, abilities all match the .ods sheet verbatim —
 *     this is the "sister datasheet" to the Knight Desecrator: identical chassis
 *     stats (M12" WS3+ BS3+ S7 FRONT13 SIDE12 REAR12 I4 A3 HP4) but a simpler,
 *     cheaper melee-focused loadout — NO Laser destructor (the Desecrator's ranged
 *     anti-tank weapon is absent here), and "2 Knight melee weapons" replaces the
 *     Desecrator's single "Knight melee weapon" in the equipped_with line; this
 *     loadout difference accounts for the 547→385pts gap (162pts cheaper)
 *   ✓ Knight melee weapon Strike/Sweep sub-profiles correctly split into separate
 *     "<weapon> - <profile>" entries (same convention as Desecrator); the source's
 *     own typo "wether" in the Ion shield ability text is preserved verbatim — not
 *     corrected to "whether", correct per FAQ#5/golden-rule (canonical text stands
 *     even with typos)
 *   ✓ option_groups: "mark" (flat unit-level pick, +20pts uniform per god — the
 *     ONLY option on this datasheet, identical to Desecrator)
 *   ✓ has_armory_access: false / has_veteran_abilities: false (no such lines in text)
 *   ✓ keywords: ["Chaos Space Marine", "Lord of War", "Vehicle"] — engine appends
 *     both "Chaos Space Marine" (faction tie-in for the per-faction LoW injection
 *     route) and "Vehicle" to the source's single "Lord of War" keyword; correct
 *     per the cross-faction supplement architecture — same pattern as Desecrator
 *   ✓ is_vehicle: true / unit_type: "Super-heavy Vehicle" / default_size: 1 /
 *     min_cost: 385
 *   🟡 Ion shield is a text-only special rule (situational invulnerability save with
 *     a player-chosen facing) — no dedicated engine primitive for directional saves;
 *     consistent treatment with Desecrator and CSM vehicles generally
 *   (Fixed mojibake in the old header comment: "â€”" → "—", encoding artefact from migration)
 */

import type { Unit } from '../../../../../src/types/data';

export const knightRampager: Unit = {
  "name": "Knight Rampager",
  "models": [
    {
      "name": "Knight Rampager",
      "points": 385,
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
  "equipped_with": "A Knight Rampager is equipped with: Heavy stubber; 2 Knight melee weapons.",
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
  "min_cost": 385
};

