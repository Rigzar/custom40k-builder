/**
 * SERVITORS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const servitors: Unit = {
  "name": "Servitors",
  "models": [
    {
      "name": "Servitor",
      "points": 12,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "5",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Servitor is equipped with: Paired shock chargers",
  "weapons": [
    {
      "name": "Heavy arc rifle",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Haywire"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Incendine combustor",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Meltagun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Paired shock chargers",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Phosphor blaster",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Luminagen"
    },
    {
      "name": "Shock charger",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma cannon - Standard",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma cannon - Overheating",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Paired shock chargers for a Shock charger and one of the following",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Phosphor blaster",
          "points": 7
        },
        {
          "name": "Meltagun",
          "points": 13
        },
        {
          "name": "Incendine combustor",
          "points": 14
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Paired shock chargers"]
    },
    {
      "header": "For every three Servitors in the unit, one may swap their Paired shock chargers for a Shock charger and one of the following",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 13
        },
        {
          "name": "Heavy arc rifle",
          "points": 15
        },
        {
          "name": "Multi-melta",
          "points": 27
        },
        {
          "name": "Plasma cannon",
          "points": 50
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Paired shock chargers"]
    },
    {
      "header": "For each Magos, Archmagos, or Tech-Priest selection, one Servitor squad may be selected that does not occupy an Elite slot.",
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
    "Monotask, Unyielding",
    "Bionics: This model receives a 6+ invulnerability save.",
    "Mind-lock: As long as a character is attached to this unit, the Servitors get +1 to hit rolls."
  ],
  "unit_type": "Infantry",
  "keywords": [],
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
  "default_size": 3,
  "min_cost": 36
};
