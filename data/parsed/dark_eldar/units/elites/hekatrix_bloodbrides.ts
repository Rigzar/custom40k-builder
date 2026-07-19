/**
 * HEKATRIX BLOODBRIDES — Elites
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Hekatrix Bloodbrides". NEW unit in 1.01.
 * Cult veteran squad: a fixed Syren champion + 4-19 Bloodbride. One unit per Succubus (HQ)
 * selection; the Bloodbrides archetype lifts that limit and makes it Troops.
 * Weapon profiles are the shared Wych set (up to FOUR blade swaps per 5, vs Wyches' two).
 */

import type { Unit } from '../../../../../src/types/data';

export const hekatrixBloodbrides: Unit = {
  "name": "Hekatrix Bloodbrides",
  "models": [
    {
      "name": "Bloodbride",
      "points": 12,
      "min": 4,
      "max": 19,
      "stats": {
        "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "3", "W": "1", "I": "5", "A": "2", "LD": "8", "SV": "6+"
      }
    },
    {
      "name": "Syren",
      "points": 17,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "3", "W": "1", "I": "5", "A": "3", "LD": "8", "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Hekatarii blade; Splinter pistol; Plasma grenade.",
  "weapons": [
    { "name": "Shardnet and impaler", "range": "-", "type": "Melee", "s": "U", "ap": "-2", "d": "1", "abilities": "Enemy models in base contact reduce their Attacks by 1 (minimum 1)" },
    { "name": "Hekatarii blade", "range": "-", "type": "Melee", "s": "U", "ap": "-2", "d": "1", "abilities": "-" },
    { "name": "Hydra gauntlets", "range": "-", "type": "Melee", "s": "U", "ap": "-2", "d": "1", "abilities": "Flurry(3)" },
    { "name": "Razorflails", "range": "-", "type": "Melee", "s": "U", "ap": "-2", "d": "1", "abilities": "Re-roll to hit and to wound rolls, Flurry(1)" },
    { "name": "Plasma grenade", "range": "-", "type": "Grenade 1", "s": "4", "ap": "-2", "d": "1", "abilities": "Explosive" },
    { "name": "Splinter pistol", "range": "12\"", "type": "Pistol 1", "s": "2", "ap": "0", "d": "1", "abilities": "Poison(3+)" }
  ],
  "option_groups": [
    {
      "header": "For each 5 models, up to four Bloodbrides may replace their Hekatarii blade",
      "constraint": { "type": "per_n", "per_n": 5, "count_per_n": 4 },
      "choices": [
        { "name": "Hydra gauntlets", "points": 1 },
        { "name": "Razorflails", "points": 1 },
        { "name": "Shardnet and impaler", "points": 1 }
      ],
      "inline_pts": null, "variant_link": null, "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat drugs, Deflect, Power through Pain, Parry",
    "For every Succubus selection, the army may include one Hekatrix Bloodbrides unit."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Cult"
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 65
};
