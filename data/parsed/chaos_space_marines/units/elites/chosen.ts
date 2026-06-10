/**
 * CHOSEN — Elites
 *
 * SOURCE: Chaos Space Marines ENG / Chosen.html (canonical datasheet)
 * ─────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME    M    WS  BS  S  T  W  I  A  LD  SV  PTS
 *   1-10  Chosen  6”   2+  2+  4  4  2  4  2   8  3+   35
 *   (all models same stats; no champion model)
 *
 * EQUIPPED WITH: A Chosen is equipped with: Krak grenades; Frag grenades.
 *
 * WEAPONS:
 *   Frag grenade  6”  Grenade 1  4  AP0   D1  Explosive
 *   Krak grenade  6”  Grenade 1  6  AP-2  D1  —
 *   (all other weapons via armory)
 *
 * OPTIONS:
 *   • For every HQ selection, army may include one Chosen unit (Command squad rule)
 *   • All models may receive a Mark of Chaos (per model):
 *     Undivided+0 / K+2 / S+2 / N+2 / T+5
 *   • Entire squad may receive ONE of the following upgrades (per model):
 *     Dark Crusaders+2 / Accursed Weaponry+3 / Monstrous Visages+3 /
 *     Malicious Ammuniton+5 / Tip of the Spear+5 / Clad in Midnight+10
 *     (NOTE: HTML typo “Malicious Ammuniton” — missing 'i'; preserved as-is in TS)
 *   • All models have armory access; up to 2 veteran abilities
 *
 * ABILITIES (verbatim):
 *   Command squad
 *   Accursed Weaponry: gains “Deflagrate(5+)” for all melee attacks.
 *   Clad in Midnight: gains “Stealth”.
 *   Dark Crusaders: unit gains “Frenzy(1”)” and rolls 2D6 (pick highest) for Advance.
 *     (NOTE: HTML shows “Frenzy(1”)” with spurious closing quote — ability name is Frenzy(1”))
 *   Malicious Ammuniton: gains “Deflagrate(5+)” for all ranged attacks.
 *   Monstrous Visages: gains “Parry” + “Gruesome” for all melee weapons.
 *   Tip of the Spear: when Infiltrating, can always place outside 12” even with LoS.
 *
 * UNIT TYPE: Character model (HTML lowercase 'm') → normalised “Character Model, Infantry, Squadron”
 * KEYWORDS: Chaos Space Marine
 *
 * ENGINE STATUS:
 *   ✓ stats, pts match HTML exactly
 *   ✓ squad upgrades: effect.grants_abilities for Dark Crusaders / Monstrous Visages /
 *     Clad in Midnight ✓
 *   ✓ has_armory_access: true (all models) ✓
 *   ✓ has_veteran_abilities: true / veteran_max: 2 ✓
 *   ✓ is_squadron: true / is_character: true ✓
 *   ✓ locked_mark: null (has Undivided option) ✓
 *   ✓ default_size: 1 / min_cost: 35 ✓
 */

import type { Unit } from '../../../../../src/types/data';

export const chosen: Unit = {
  "name": "Chosen",
  "models": [
    {
      "name": "Chosen",
      "points": 35,
      "min": 1,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Chosen is equipped with: Krak grenades; Frag grenades.",
  "weapons": [
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
    }
  ],
  "option_groups": [
    {
      "header": "For every HQ selection, the army may include one Chosen unit.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All models may receive a Mark of Chaos (points per model)",
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
          "points": 2
        },
        {
          "name": "Slaanesh",
          "points": 2
        },
        {
          "name": "Nurgle",
          "points": 2
        },
        {
          "name": "Tzeentch",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Dark Crusaders",
          "points": 2,
          "effect": { "grants_abilities": ["Frenzy(1\")"] }
        },
        {
          "name": "Accursed Weaponry",
          "points": 3
        },
        {
          "name": "Monstrous Visages",
          "points": 3,
          "effect": { "grants_abilities": ["Parry"] }
        },
        {
          "name": "Malicious Ammuniton",
          "points": 5
        },
        {
          "name": "Tip of the Spear",
          "points": 5
        },
        {
          "name": "Clad in Midnight",
          "points": 10,
          "effect": { "grants_abilities": ["Stealth"] }
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad",
    "Accursed Weaponry: The model gains the \"Deflagrate(5+)\" ability for all melee attacks.",
    "Clad in Midnight: The model gains the \"Stealth\" ability.",
    "Dark Crusaders: The model and its attached unit gain the \"Frenzy(1\")\" ability and roll 2D6 (pick highest) for the extra movement with an Advance order.",
    "Malicious Ammuniton: The model gains the \"Deflagrate(5+)\" ability for all ranged attacks.",
    "Monstrous Visages: The model gains the \"Parry\" ability and additionally the \"Gruesome\" ability for all melee weapons.",
    "Tip of the Spear: When set up using the Infiltrator rules, the model can always be placed outside 12\" of an enemy unit, even if there is direct line of sight."
  ],
  "unit_type": "Character Model, Infantry, Squadron",
  "keywords": [
    "Chaos Space Marine"
  ],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "is_squadron": true,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 35
};

