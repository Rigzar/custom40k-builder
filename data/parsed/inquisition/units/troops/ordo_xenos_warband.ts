/**
 * ORDO XENOS WARBAND — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: A Psyker can cast 1 psychic power and dispel 1 psychic power per round. A Psyker knows Smite, as well as one psychic power from a chosen psychic discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const ordoXenosWarband: Unit = {
  "name": "Ordo Xenos Warband",
  "models": [
    {
      "name": "Acolyte",
      "points": 6,
      "min": 0,
      "max": 12,
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
      "name": "Alien World Scout",
      "points": 10,
      "min": 0,
      "max": 1,
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
      "name": "Archaeotech Researcher",
      "points": 10,
      "min": 0,
      "max": 1,
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
      "name": "Psyker",
      "points": 10,
      "min": 0,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Servitor",
      "points": 8,
      "min": 0,
      "max": 3,
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
    },
    {
      "name": "Xenologist",
      "points": 10,
      "min": 0,
      "max": 1,
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
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Acolyte is equipped with: -",
  "weapons": [
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
      "name": "Laspistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    }
  ],
  "option_groups": [
    {
      "header": "Only for armies with an Ordo Xenos Inquisitor.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A warband consists of a maximum of 12 models. Each army can only contain a single warband.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each Servitor can be equipped with one of the following weapons",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 9
        },
        {
          "name": "Multi-melta",
          "points": 18
        },
        {
          "name": "Plasma cannon",
          "points": 49
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may get one of these abilities (points per model, including an attached Inquisitor)",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Deep strike",
          "points": 0
        },
        {
          "name": "Infiltrator",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Archaeotech Enhancement: While an Archaeotech Researcher is alive in the unit, all weapons in the unit gain Armor piercing(5+).",
    "Bodyguard: Every Acolyte has the \"Bodyguard\" special ability.",
    "Know Your Enemy: As long as a Xenologist is alive in the unit, it gains the \"Favoured enemy\" special rule against all Xeno factions.",
    "Leadership: As long as an Alien World Scout is alive in the unit, it gains the \"Use Cover\" and \"Move Through Cover\" special rule.",
    "Psyker: A Psyker can cast 1 psychic power and dispel 1 psychic power per round. A Psyker knows Smite, as well as one psychic power from a chosen psychic discipline.",
    "Servitor: As long as the Inquisitor is alive, Servitors get +1 to hit rolls."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 1,
  "min_cost": 6,
  "requires_army_item": "Ordo Xenos"
};
