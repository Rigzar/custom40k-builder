/**
 * SECUTARII PELTASTS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const secutariiPeltasts: Unit = {
  "name": "Secutarii Peltasts",
  "models": [
    {
      "name": "Peltast",
      "points": 30,
      "min": 4,
      "max": 19,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Peltast Alpha",
      "points": 35,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Galvanic caster.",
  "weapons": [
    {
      "name": "Galvanic caster - Flechette",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Shred"
    },
    {
      "name": "Galvanic caster - Ignis",
      "range": "18\"",
      "type": "Assault 2",
      "s": "3",
      "ap": "-1",
      "d": "1",
      "abilities": "Blind, Sunder(2)"
    },
    {
      "name": "Galvanic caster - Hammershot",
      "range": "30\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-3",
      "d": "2",
      "abilities": "Precision(6+)"
    }
  ],
  "option_groups": [
    {
      "header": "One Peltast may be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Enhanced data-tether",
          "points": 10
        },
        {
          "name": "Omnispex",
          "points": 10
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
    "Canticles of the Omnissiah",
    "Blind Barrage: Once per game, instead of firing normally, select a friendly unit within 18\". The selected unit gains the benefit of obscuring terrain until this unit's next activation.",
    "Kyropatris Field Generator: This model receives a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 155
};
