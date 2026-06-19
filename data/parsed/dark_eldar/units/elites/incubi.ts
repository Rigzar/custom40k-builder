/**
 * INCUBI — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const incubi: Unit = {
  "name": "Incubi",
  "models": [
    {
      "name": "Incubus",
      "points": 25,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Klaivex",
      "points": 47,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every Incubus is equipped with: Klaive. The Klaivex is equipped with: Demiklaives.",
  "weapons": [
    {
      "name": "Klaive",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "1",
      "abilities": "Deadly(5+), Flurry(1)"
    },
    {
      "name": "Demiklaives (dual blades)",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Demiklaives (single blade)",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "1",
      "abilities": "Deadly(5+), Flurry(1)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to a Klaivex for +22 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 22,
      "variant_link": "Klaivex",
      "is_unique_per_army": false
    },
    {
      "header": "The Klaivex replaces its Klaive with Demiklaives (choose one mode)",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Demiklaives (dual blades)",
          "points": 0
        },
        {
          "name": "Demiklaives (single blade)",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "replaces": ["Klaive"],
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Power through Pain",
    "Aspect armor: The model gains a 5+ invulnerability save.",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORDS to the unit."
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 125
};
