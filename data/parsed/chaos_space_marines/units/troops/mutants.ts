/**
 * MUTANTS — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Mutants.html (canonical datasheet)
 * ────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.    NAME         M    WS  BS  S  T  W  I  A  LD  SV   PTS
 *   15-30  Mutant       6”   4+  5+  3  4  1  3  2   5  5+     6
 *   *      Mutant Boss  6”   4+  5+  3  4  1  3  2   6  5+    11  [champion, armory access]
 *
 * EQUIPPED WITH: Every model is equipped with: Crude melee weapon; Frag grenades.
 *
 * WEAPONS:
 *   Crude melee weapon   —    Melee         U  AP0  D1  —
 *   Flamer              9''   Assault 4     4  AP0  D1  Flames          [option, 3 max]
 *   Frag grenade         6”   Grenade 1     4  AP0  D1  Explosive
 *   Heavy machine gun   36”   Heavy 3       4  AP0  D1  Suppression     [option, 3 max]
 *   Machine gun         24”   Rapid Fire 1  3  AP0  D1  —               [option, per model]
 *   Machine pistol      12”   Pistol 1      3  AP0  D1  —               [option, per model]
 *
 * OPTIONS:
 *   • Entire unit may receive one of the following upgrades per model:
 *     Burly/brawny/goatheaded +1 / Horrifying/hypnotic/brightly coloured +1 /
 *     Leaping/floating/winged +2 / Bloated +3
 *   • Any model may swap Crude melee weapon: Crude melee weapon & Machine pistol +1 / Machine gun +1
 *   • Up to 3 models may swap Crude melee weapon: Flamer +8 / Heavy machine gun +8
 *   • Mutant Boss upgrade (1 per unit): armory access, +5 pts
 *
 * ABILITIES (verbatim):
 *   Upgrades:
 *   Bloated: The model gains a 4+ armor save.
 *   Burly, brawny or goatheaded: The model gains +1 Strength.
 *   Horrifying, hypnotic or brightly coloured: The unit gains the cumulative ability “Terrifying(-1)”.
 *   Leaping, floating or winged: The model gains the “Anti-Grav” and “Haste(1”)” abilities.
 *
 * UNIT TYPE: Infantry
 * KEYWORDS: Cultist
 *   (NO marks, no Chaos Space Marine keyword)
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly (min 15, max 30) ✓
 *   ✓ all 6 weapons match HTML exactly ✓
 *   ✓ 4 upgrade choices with stat_mod/grants_abilities effects ✓
 *   ✓ per-model and fixed_max swap groups ✓
 *   ✓ Mutant Boss as variant_model, champion_has_armory: true ✓
 *   ✓ no marks (locked_mark: null, no mark option_group) ✓
 *   ✓ default_size: 15 / min_cost: 90 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const mutants: Unit = {
  "name": "Mutants",
  "models": [
    {
      "name": "Mutant",
      "points": 6,
      "min": 15,
      "max": 30,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "5+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "5",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Mutant Boss",
      "points": 11,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "5+",
        "S": "3",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Crude melee weapon; Frag grenades.",
  "weapons": [
    {
      "name": "Crude melee weapon",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamer",
      "range": "9''",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
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
    },
    {
      "name": "Heavy machine gun",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Machine gun",
      "range": "24\"",
      "type": "Rapid Fire 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Machine pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "The entire unit may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [        {
          "name": "Burly, brawny or goatheaded",
          "points": 1,
          "effect": { "stat_mod": [{ "stat": "S", "delta": 1 }] }
        },        {
          "name": "Horrifying, hypnotic or brightly coloured",
          "points": 1,
          "effect": { "grants_abilities": ["Terrifying(-1)"] }
        },        {
          "name": "Leaping, floating or winged",
          "points": 2,
          "effect": { "grants_abilities": ["Anti-Grav", "Haste(1\")"] }
        },        {
          "name": "Bloated",
          "points": 3,
          "effect": { "stat_mod": [{ "stat": "SV", "delta": -1 }] }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Any model may swap their Crude melee weapon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Crude melee weapon & Machine pistol",
          "points": 1
        },
        {
          "name": "Machine gun",
          "points": 1
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Crude melee weapon"]
    },
    {
      "header": "Up to three models may swap their Crude melee weapon",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Flamer",
          "points": 8
        },
        {
          "name": "Heavy machine gun",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A Mutant may be upgraded to a Mutant Boss for +5 points. The Mutant Boss has access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Mutant Boss",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bloated: The model gains a 4+ armor save.",
    "Burly, brawny or goatheaded: The model gains +1 Strength.",
    "Horrifying, hypnotic or brightly coloured: The unit gains the cumulative ability \"Terrifying(-1)\".",
    "Leaping, floating or winged: The model gains the \"Anti-Grav\" and \"Haste(1\")\" abilities."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Cultist"
  ],
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
  "default_size": 15,
  "min_cost": 90
};

