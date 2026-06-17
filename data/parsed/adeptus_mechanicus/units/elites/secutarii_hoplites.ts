/**
 * SECUTARII HOPLITES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const secutariiHoplites: Unit = {
  "name": "Secutarii Hoplites",
  "models": [
    {
      "name": "Hoplite",
      "points": 23,
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
      "name": "Hoplite Alpha",
      "points": 28,
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
  "equipped_with": "Every model is equipped with: Arc lance.",
  "weapons": [
    {
      "name": "Arc lance - Shock",
      "range": "12\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Arc lance - Thrust",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "Haywire"
    }
  ],
  "option_groups": [
    {
      "header": "One Hoplite may be equipped with",
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
    "Canticles of the Omnissiah, Parry",
    "Kyropatris Field Generator: This model receives a 5+ invulnerability save.",
    "Mag-inverter Shield: Each time this model makes an unmodified saving throw of 6 against a melee attack, the attacking unit suffers 1 mortal wound after it has made all of its attacks."
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
  "min_cost": 120
};
