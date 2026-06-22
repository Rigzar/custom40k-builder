/**
 * NOISE MARINES — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Noise Marines.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME           M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   4-11  Noise Marine   8"   3+  3+  4  4  2  5  2   8  3+   37
 *   1     Noise Champion  8"   3+  3+  4  4  2  5  2   8  3+   42
 *
 * EQUIPPED WITH: Each model is equipped with: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.
 *
 * WEAPONS:
 *   Astartes Chainsword            —   Melee         SU   AP-1  D1  -
 *   Bolt pistol                   12"  Pistol 1       S4   AP-1  D1  -
 *   Bolter                        24"  Rapid fire 1   S4   AP-1  D1  -
 *   Blastmaster - Single freq.    36"  Heavy 1        S8   AP-2  D2  AT(2), Sunder(2), Suppression
 *   Blastmaster - Varied freq.    24"  Assault 1      S5   AP-1  D1  Explosive, Sunder(2), Suppression
 *   Duelling sabre                 —   Melee         SU   AP-2  D1  Parry
 *   Frag grenade                   6"  Grenade 1      S4   AP 0  D1  Explosive
 *   Krak grenade                   6"  Grenade 1      S6   AP-2  D1  -
 *   Meltagun                      12"  Assault 1      S8   AP-5  D1  AT(1), Melta
 *   Plasma gun - Standard         24"  Rapid fire 1   S7   AP-3  D1  AT(1)
 *   Plasma gun - Overcharged      24"  Rapid fire 1   S8   AP-4  D2  AT(2), Overheat
 *   Sonic blaster                 24"  Assault 2      S4   AP-1  D1  Sunder(2), Suppression
 *
 * OPTIONS:
 *   • Each model's Bolt pistol may be replaced with:
 *     Bolter +3 / Sonic blaster +9
 *   • Each model's Astartes Chainsword may be replaced with:
 *     Duelling sabre +3
 *   • Two Noise Marines' Bolt pistols can be replaced with (max 2):
 *     Meltagun +15 / Plasma gun +20 / Blastmaster +30
 *   • If unit is 12 models, another two Bolt pistols may be replaced (max 2 additional)
 *   • The Noise Champion has access to the armory.
 *   • This unit may have 1 veteran ability.
 *
 * SOURCE NOTES:
 *   - HTML keyword is "Emperor's Champion" — clear typo; should be "Emperor's Children".
 *     Production JSON has the correct value; canonical here.
 *   - HTML option points use "Punkte" (German locale artifact) → corrected to numeric in TS.
 *
 * ABILITIES (verbatim): Mark of Slaanesh
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Emperor's Children  (HTML erroneously says "Emperor's Champion")
 *
 * ENGINE STATUS:
 *   ✓ stats, pts, weapons all match HTML (correcting source artefacts above)
 *   ✓ locked_mark: "Slaanesh" (from Mark of Slaanesh ability)
 *   ✓ champion_has_armory: true / has_veteran_abilities: true / veteran_max: 1
 *   ✓ fixed_max:2 heavy-weapon swap + conditional 12-model second swap
 *   ✓ replaces: ["Bolt pistol"] / replaces: ["Astartes Chainsword"] on every-swap groups
 *   ✓ default_size: 5 / min_cost: 190 (4×37 + 1×42 = 190) ✓
 *   ❌ 12-model second swap available_if unit_size==12 — not enforced (shown always)
 *   ✓ no armourKeyword (no Terminator/Cataphractii armour)
 */

import type { Unit } from '../../../../../src/types/data';

export const noiseMarines: Unit = {
  "name": "Noise Marines",
  "models": [
    {
      "name": "Noise Marine",
      "points": 37,
      "min": 4,
      "max": 11,
      "stats": {
        "M": "8\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    },
    {
      "name": "Noise Champion",
      "points": 42,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "8\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each model is equipped with: Astartes Chainsword; Bolt pistol; Frag grenades; Krak grenades.",
  "weapons": [
    {
      "name": "Astartes Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bolter",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Duelling sabre",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Parry"
    },
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Meltagun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Blastmaster - Single frequency",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Sunder(2), Suppression"
    },
    {
      "name": "Blastmaster - Varied frequency",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Sunder(2), Suppression"
    },
    {
      "name": "Plasma gun - Standard",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma gun - Overcharged",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheat"
    },
    {
      "name": "Sonic blaster",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Sunder(2), Suppression"
    }
  ],
  "option_groups": [
    {
      "header": "Each model's Bolt pistol may be replaced with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Bolter",
          "points": 3
        },
        {
          "name": "Sonic blaster",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Bolt pistol"
      ]
    },
    {
      "header": "Each model's Astartes Chainsword may be replaced with",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Duelling sabre",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Astartes Chainsword"
      ]
    },
    {
      "header": "Two Noise Marine's Bolt pistols can be replaced with (max 2)",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Meltagun",
          "points": 15
        },
        {
          "name": "Plasma gun",
          "points": 20
        },
        {
          "name": "Blastmaster",
          "points": 30
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt pistol"]
    },
    {
      "header": "If the unit consists of 12 models, another two Noise Marine's Bolt pistols may be replaced (max 2)",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Meltagun",
          "points": 15
        },
        {
          "name": "Plasma gun",
          "points": 20
        },
        {
          "name": "Blastmaster",
          "points": 30
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Bolt pistol"]
    }
  ],
  "abilities": [
    "Mark of Slaanesh"
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Emperor's Children"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": "Slaanesh",
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 190
};
