/**
 * TRAITOR GUARD — Troops
 *
 * SOURCE: Chaos Space Marines ENG / Traitor Guard.html (canonical datasheet)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * PROFILE:
 *   No.   NAME                M    WS   BS   S  T  W  I  A  LD  SV  PTS
 *   10-30 Traitor Guardsman   6"   4+   4+   3  3  1  3  1   6  5+   8
 *   *     Traitor Sergeant    6"   4+   4+   3  3  1  3  1   7  5+  13  (variant, +5pts)
 *   0-3   Chaos Ogryn         6"   4+   -    5  5  3  3  4   6  5+  28  (per 10 models)
 *
 * EQUIPPED WITH:
 *   Every Traitor Guardsman: Lasgun, Frag grenades.
 *   Every Chaos Ogryn: Power maul.
 *
 * OPTIONS:
 *   Marks (per model): Khorne+1 / Slaanesh+1 / Nurgle+1 / Tzeentch+2 (NO Undivided)
 *   Each model Lasgun -> Chainsword + Laspistol (free)
 *   Per 10 models: 1 Guardsman -> Flamer+5 / Melter+11 / Plasma gun+15
 *   For each 10 models: 1 Chaos Ogryn (0-3 max)
 *   Traitor Sergeant: armory access (+5pts)
 *
 * ABILITIES:
 *   Bodyguard (Chaos Ogryn only): wounds allocated to Ogryn first; Precision attacks -1 hit.
 *
 * KEYWORDS: Cultist
 * UNIT TYPE: Infantry
 *
 * ENGINE STATUS:
 *   Multi-group: Guardsmen (10-30) + Sergeant (variant) + Ogryn (0-3).
 *   Per-10 rule for Ogryn enforced via applies_to_model cap.
 *   Bug2 (ki-bug-mixedmodel-pricing-01): Traitor Guard additional-model cost uses Ogryn price — deferred.
 */

import type { Unit } from '../../../../../src/types/data';

export const traitorGuard: Unit = {
  "name": "Traitor Guard",
  "models": [
    {
      "name": "Traitor Guardsman",
      "points": 8,
      "min": 10,
      "max": 30,
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
        "SV": "5+"
      }
    },
    {
      "name": "Chaos Ogryn",
      "points": 28,
      "min": 0,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "-",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "4",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Traitor Sergeant",
      "points": 13,
      "min": 0,
      "max": 0,
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
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every Traitor Guardsman is equipped with: Lasgun; Frag grenades. Every Chaos Ogryn is equipped with: Power maul.",
  "weapons": [
    {
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Flamer",
      "range": "9\"",
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
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lasgun",
      "range": "24\"",
      "type": "Rapid fire 1",
      "s": "3",
      "ap": "0",
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
      "name": "Melter",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melter"
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
      "name": "Power maul",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "All models may receive a mark of chaos (points per model)",
      "constraint": { "type": "mark" },
      "choices": [
        { "name": "Khorne",    "points": 1 },
        { "name": "Slaanesh",  "points": 1 },
        { "name": "Nurgle",    "points": 1 },
        { "name": "Tzeentch",  "points": 2 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model's Lasgun may be replaced by a Chainsword and a Laspistol",
      "constraint": { "type": "every" },
      "choices": [
        { "name": "Chainsword & Laspistol", "points": 0 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Lasgun"]
    },
    {
      "header": "For each 10 models, one Traitor Guardsman's Lasgun may be replaced by",
      "constraint": { "type": "per_n", "per_n": 10, "count_per_n": 1 },
      "applies_to_model": "Traitor Guardsman",
      "choices": [
        { "name": "Flamer",    "points": 5  },
        { "name": "Melter",    "points": 11 },
        { "name": "Plasma gun","points": 15 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Traitor Guardsman may be promoted to a Traitor Sergeant for +5pts and gains access to the armory.",
      "constraint": { "type": "one" },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Traitor Sergeant",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bodyguard (Chaos Ogryn only): Wounds inflicted must first be allocated to the model before other models in the unit can be selected. Attacks with the \"Precision\" rule take a -1 hit penalty if they affect an attached character."
  ],
  "unit_type": "Infantry",
  "keywords": ["Cultist"],
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
  "min_cost": 80
};
