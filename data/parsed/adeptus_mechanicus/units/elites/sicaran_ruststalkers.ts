/**
 * SICARAN RUSTSTALKERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sicaranRuststalkers: Unit = {
  "name": "Sicaran Ruststalkers",
  "models": [
    {
      "name": "Ruststalker",
      "points": 32,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Ruststalker Princeps",
      "points": 32,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Enhanced Bionics; Transonic blades.",
  "weapons": [
    {
      "name": "Chordclaw",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "2",
      "abilities": "Extra attack"
    },
    {
      "name": "Mindscrambler grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "2",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Suppression"
    },
    {
      "name": "Transonic blades",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+), Flurry(1)"
    },
    {
      "name": "Transonic razor",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Transonic blades",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Chordclaw & Transonic razor",
          "points": 4
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may select one Doctrina Imperative.",
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
    "Canticles of the Omnissiah, Massive(1), Move through cover, Use cover",
    "Enhanced Bionics: The model receives a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 160
};
