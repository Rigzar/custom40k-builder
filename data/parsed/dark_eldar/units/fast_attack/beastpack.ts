/**
 * BEASTPACK — Fast Attack
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Beastpack". NEW unit in 1.01.
 * A fixed Beastmaster + 2-10 beasts (3-11 models any combination). No sub-faction keyword —
 * "Swords for hire" lets it join any. Per-model unit types (Bike/Jump pack/Monstrous/Swarm) are
 * documented in the abilities line; the single unit_type field carries the infantry base.
 */

import type { Unit } from '../../../../../src/types/data';

export const beastpack: Unit = {
  "name": "Beastpack",
  "models": [
    {
      "name": "Beastmaster",
      "points": 26,
      "min": 1,
      "max": 1,
      "stats": { "M": "12\"", "WS": "3+", "BS": "3+", "S": "3", "T": "4", "W": "2", "I": "5", "A": "2", "LD": "8", "SV": "5+" }
    },
    {
      "name": "Clawed Fiend",
      "points": 32,
      "min": 0,
      "max": 10,
      "stats": { "M": "6\"", "WS": "4+", "BS": "4+", "S": "5", "T": "5", "W": "3", "I": "4", "A": "3", "LD": "5", "SV": "6+" }
    },
    {
      "name": "Khymerae",
      "points": 24,
      "min": 0,
      "max": 10,
      "stats": { "M": "12\"", "WS": "3+", "BS": "3+", "S": "4", "T": "4", "W": "2", "I": "5", "A": "2", "LD": "5", "SV": "6+" }
    },
    {
      "name": "Razorwing Flock",
      "points": 28,
      "min": 0,
      "max": 10,
      "stats": { "M": "12\"", "WS": "5+", "BS": "5+", "S": "3", "T": "3", "W": "3", "I": "4", "A": "3", "LD": "5", "SV": "6+" }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Beastmaster is equipped with: Agonizer; Splinter pistol. Every Clawed Fiend is equipped with: Clawed fists. Every Khymerae is equipped with: Claws and talons. Every Razorwing Flock is equipped with: Razor feathers.",
  "weapons": [
    { "name": "Agonizer", "range": "-", "type": "Melee", "s": "U", "ap": "-3", "d": "1", "abilities": "Poison(3+)" },
    { "name": "Clawed fists", "range": "-", "type": "Melee", "s": "+2", "ap": "-2", "d": "2", "abilities": "AT(1), Slow(-1)" },
    { "name": "Claws and talons", "range": "-", "type": "Melee", "s": "U", "ap": "-2", "d": "1", "abilities": "Gruesome" },
    { "name": "Razor feathers", "range": "-", "type": "Melee", "s": "U", "ap": "1", "d": "1", "abilities": "Rending(5+)" },
    { "name": "Splinter pistol", "range": "12\"", "type": "Pistol 1", "s": "2", "ap": "0", "d": "1", "abilities": "Poison(3+)" }
  ],
  "option_groups": [],
  "abilities": [
    "Berserk(5+) (Clawed Fiend only), Deep Strike (Khymerae only), Power through Pain, Terrifying(-1) (Khymerae only)",
    "Otherwordly: Khymaraes gain a 5+ invulnerability save.",
    "The unit consists of 3 to 11 models in any combination.",
    "Unit types: Bike (Khymaerae only), Jump pack Infantry (Beastmaster and Razorwing Flock only), Monstrous Infantry (Clawed Fiend only), Swarm (Razorwing Flock only).",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORD to the unit."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "-"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 74
};
