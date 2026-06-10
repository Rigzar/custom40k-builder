/**
 * DARK COMMUNE — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Dark Commune.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE (4-model warband, all required):
 *   No.  NAME              M    WS  BS   S  T  W  I  A  LD  SV  PTS
 *   1-2  Dark Executioner  6”   4+  —    4  3  1  3  2   6  4+   13
 *   1    Cult Demagogue    6”   4+  4+   3  3  1  3  1   6  4+   42
 *   1    Mindsorcerer      6”   4+  4+   3  3  1  3  1   6  4+   20
 *   1    Cult Bannerbearer 6”   4+  4+   3  3  1  3  1   7  4+   15
 *
 * EQUIPPED WITH:
 *   Every Dark Executioner: Executioners blade; Frag grenades.
 *   Cult Demagogue: Unholy stave; Laspistol; Frag grenade.
 *   Mindsorcerer: Witchcane; Balefire tome; Frag grenades.
 *   Cult Bannerbearer: Laspistol; Frag grenades.
 *   (HTML uses “Cult Standardbearer” in equipment section — TS correctly uses “Cult Bannerbearer”
 *    from the stats table)
 *
 * WEAPONS:
 *   Executioners blade   —    Melee      +2  AP2   D1  Slow(-1)
 *   Unholy stave         —    Melee      +2  AP1   D1  —
 *   Laspistol            12”  Pistol 1    3  AP0   D1  —
 *   Witchcane - Sinister bolt  12”  Assault 1  5  AP-1  D1  —
 *   Witchcane - Melee    —    Melee      +2  AP-1  D1  Force weapon
 *   Frag grenade          6”  Grenade 1   4  AP0   D1  Explosive
 *   (NOTE: Executioners blade AP=”2” and Unholy stave AP=”1” match HTML exactly —
 *    no minus sign in source; values preserved as-is)
 *
 * OPTIONS:
 *   • All models may receive a Mark of Chaos (per model): K+1 / S+1 / N+1 / T+2
 *     (NO Undivided option)
 *
 * ABILITIES (verbatim):
 *   Faithful: A Cult Demagogue may pray once per turn (3+). Knows all prayers from a chosen list.
 *   Chaos banner: Cultists within 6” use the Ld of the bearer.
 *   Command squad: For every HQ choice you may buy one Dark Commune which doesn't take an Elite slot.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Cultist, Psyker
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (4 models, mandatory warband composition)
 *   ✓ all weapons match HTML (AP values “2” and “1” without minus preserved from source)
 *   ✓ marks: K/S/N/T only — no Undivided ✓
 *   ✓ is_psyker: true (Mindsorcerer), is_priest: true (Cult Demagogue) ✓
 *   ✓ is_cult_initiate: true ✓
 *   ✓ has_armory_access: false / champion_has_armory: false ✓
 *   ✓ has_veteran_abilities: false / veteran_max: null ✓
 *   ✓ default_size: 4 / min_cost: 90 (13+42+20+15 = 90) ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const darkCommune: Unit = {
  "name": "Dark Commune",
  "models": [
    {
      "name": "Dark Executioner",
      "points": 13,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "-",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Cult Demagogue",
      "points": 42,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Mindsorcerer",
      "points": 20,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Cult Bannerbearer",
      "points": 15,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Dark Executioner is equipped with: Executioners blade; Frag grenades. The Cult Demagogue is equipped with: Unholy stave; Laspistol; Frag grenade. The Mindsorcerer is equipped with: Witchcane; Balefire tome; Frag grenades. The Cult Bannerbearer is equipped with: Laspistol; Frag grenades.",
  "weapons": [
    {
      "name": "Executioners blade",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "2",
      "d": "1",
      "abilities": "Slow(-1)"
    },
    {
      "name": "Unholy stave",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Laspistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Witchcane - Sinister bolt",
      "range": "12\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Witchcane - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "1",
      "abilities": "Force weapon"
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
      "header": "All models may receive a mark of chaos (points per model)",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        {
          "name": "Khorne",
          "points": 1
        },
        {
          "name": "Slaanesh",
          "points": 1
        },
        {
          "name": "Nurgle",
          "points": 1
        },
        {
          "name": "Tzeentch",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Faithful: A Cult Demagogue may pray once per turn. A prayer is successful at a roll of 3+. A Cult Demagogue knows all prayers from a chosen list.",
    "Chaos banner: Cultists within 6\" use the Ld of the bearer.",
    "Command squad: For every HQ choice you may buy one Dark Commune unit which doesn't take an Elite slot."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Cultist",
    "Psyker"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 4,
  "min_cost": 90,
  "is_cult_initiate": true,
  "is_priest": true
};


