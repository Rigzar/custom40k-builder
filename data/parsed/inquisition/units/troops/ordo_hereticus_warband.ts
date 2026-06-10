/**
 * ORDO HERETICUS WARBAND — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ordoHereticusWarband: Unit = {
  "name": "Ordo Hereticus Warband",
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
      "name": "Arco-flagellant",
      "points": 13,
      "min": 0,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "6+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "6+"
      }
    },
    {
      "name": "Penitent",
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
      "name": "Surgeon",
      "points": 10,
      "min": 0,
      "max": 2,
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
      "name": "Missionary",
      "points": 10,
      "min": 0,
      "max": 2,
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
      "name": "Sage",
      "points": 10,
      "min": 0,
      "max": 2,
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
      "name": "Arco flail",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Chainsword",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Eviscerator",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "Armorbane, AT(2), Slow(-2), Unwieldy"
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
      "header": "Only for armies with an Ordo Hereticus Inquisitor.",
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
      "header": "Each Missionary can be equipped with an Eviscerator for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
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
    "Arco-flagellant: Every Arco-flagellant has the \"Berserker(5+)\" and \"Blind rage\" special ability.",
    "Bodyguard: Every Acolyte has the \"Bodyguard\" special ability.",
    "Devout: A Missionary can recite 1 hymn per turn. A hymn is successfully recited on a roll of 3+. A missionary knows a prayer from the hymns of battle.",
    "Narthecium: Once per turn, the damage of a wound against the model or attached unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above.",
    "Pariah: While a Penitent is alive, the unit gains the \"Aegis(4+)\" special ability.",
    "Servitor: As long as the Inquisitor is alive, Servitors get +1 to hit rolls.",
    "Wise Guidance: While a Sage is alive in the unit, all weapons in the unit gain Deflagration(5+)."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
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
  "requires_army_item": "Ordo Hereticus"
};
