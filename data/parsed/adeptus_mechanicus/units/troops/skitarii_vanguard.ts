/**
 * SKITARII VANGUARD — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skitariiVanguard: Unit = {
  "name": "Skitarii Vanguard",
  "models": [
    {
      "name": "Vanguard",
      "points": 17,
      "min": 4,
      "max": 19,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Vanguard Alpha",
      "points": 22,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bionics; Radium carbine.",
  "weapons": [
    {
      "name": "Arc rifle",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Grav serpenta",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Explosive, Grav"
    },
    {
      "name": "Radium carbine",
      "range": "18\"",
      "type": "Assault 3",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Decimate"
    },
    {
      "name": "Transuranic arquebus",
      "range": "60\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-4",
      "d": "2",
      "abilities": "Armorbane, AT(1), Deadly(5+)"
    },
    {
      "name": "Plasma caliver - Standard",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma caliver - Overheating",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "One Vanguard may be equipped with",
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
      "header": "For every 10 models, up to two Vanguards may swap their Radium carbine",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Arc rifle",
          "points": 8
        },
        {
          "name": "Grav serpenta",
          "points": 16
        },
        {
          "name": "Plasma caliver",
          "points": 36
        },
        {
          "name": "Transuranic arquebus",
          "points": 44
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
    "Bionics: The model receives a 6+ invulnerability save.",
    "Rad-saturation: Enemy models in direct base contact suffer a -1 penalty to their Toughness.",
    "Sniper: A model equipped with a Transuranic arquebus improves its BS by +1."
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
  "slot": "Troops",
  "default_size": 5,
  "min_cost": 90
};
