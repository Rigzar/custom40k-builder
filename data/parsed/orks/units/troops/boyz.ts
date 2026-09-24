/**
 * BOYZ — Troops
 *
 * SOURCE (canonical — Orks ENG/Boyz.html)
 * ────────────────────────────────────────────────────────────────────
 * PROFILES:
 *   10-30  Boy   M:6" WS:3+ BS:5+ S:4 T:4 W:1 I:3 A:2 LD:5 SV:6+ — 10 pts
 *   *      Nob   M:6" WS:3+ BS:5+ S:5 T:4 W:2 I:3 A:3 LD:6 SV:6+ — 25 pts
 * EQUIPPED WITH: Every model: Choppa; Slugga; Stikkbombz.
 * WEAPONS:
 *   Big shoota      36" Assault 3 S:5 AP:-1 D:1 -
 *   Burna - Melee    -  Melee     S:U AP:-3 D:1 Unwieldy
 *   Burna - Ranged   9" Assault 4 S:4 AP:0  D:1 Auto Hit, Sunder(1)
 *   Choppa           -  Melee     S:U AP:-1 D:1 -
 *   Rokkit launcha  24" Assault 1 S:8 AP:-3 D:2 AT(2), Anti-air
 *   Shoota          18" Assault 3 S:4 AP:0  D:1 -
 *   Slugga          12" Pistol 1  S:4 AP:0  D:1 -
 *   Stikkbombz       6" Grenade 1 S:3 AP:0  D:1 Blast(4)
 * OPTIONS (UPDATED 2026-09-24 per author's sheet):
 *   Squad-wide: 'Eavy armour +6 pts (per model)
 *   Any number of models may do ONE of: replace Choppa+Slugga with a Shoota (+0), OR keep
 *     Choppa+Slugga and be additionally equipped with a Shoota (+4) — two separate groups since
 *     one replaces gear and the other adds to it; both grant the "Shoota" choice `requires_choice`
 *     below reads for.
 *   For every 10 models, TWO Boyz already equipped with a Shoota may swap it for: Big shoota +8 /
 *     Burna +8 / Rokkit launcha +12 (gated on the Shoota option above — was wrongly modeled as a
 *     direct Choppa+Slugga swap for one Boy only, with no Burna choice and no Shoota prerequisite).
 *   One Boy → Nob +15 pts + armory. Can get one Kustom job.
 * ABILITIES: Dakka Dakka Dakka, Furious charge, Mob, Waaagh!
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS (audited 2026-09-24): stats/points/weapons match sheet. Added Burna (2 profiles,
 *   same shape as Burna Boyz' own "Burna - Melee"/"Burna - Ranged"). Split the old single
 *   "swap Choppa+Slugga for a Shoota" group into two (replace vs. additional), and re-gated the
 *   heavy-weapon swap onto the Shoota choice via `requires_choice`, matching the sheet's two-step
 *   upgrade path (Choppa+Slugga → Shoota → Big shoota/Burna/Rokkit launcha).
 */

import type { Unit } from '../../../../../src/types/data';

export const boyz: Unit = {
  "name": "Boyz",
  "models": [
    {
      "name": "Boy",
      "points": 10,
      "min": 10,
      "max": 30,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Nob",
      "points": 25,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Choppa; Slugga; Stikkbombz.",
  "weapons": [
    {
      "name": "Big shoota",
      "range": "36\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Burna - Melee",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Unwieldy"
    },
    {
      "name": "Burna - Ranged",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Auto Hit, Sunder(1)"
    },
    {
      "name": "Choppa",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Shoota",
      "range": "18\"",
      "type": "Assault 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Slugga",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Blast(4)"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "'Eavy armour",
          "points": 6,
          "effect": {
            "grants_abilities": ["'Eavy armour: The model gains a 4+ armor save."],
            "stat_mod": [{ "stat": "SV", "delta": -2 }]
          }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "Any number of models may replace their Choppa and Slugga with a Shoota",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shoota",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Choppa", "Slugga"]
    },
    {
      "header": "Any number of models may be additionally equipped with a Shoota",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shoota",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For every 10 models, two Boyz equipped with a Shoota may swap it",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 8
        },
        {
          "name": "Burna",
          "points": 8
        },
        {
          "name": "Rokkit launcha",
          "points": 12
        }
      ],
      "replaces": [
        "Shoota"
      ],
      "requires_choice": ["Shoota"],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Boy may be upgraded to a Nob for +15 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Nob",
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 10,
  "min_cost": 100
};
