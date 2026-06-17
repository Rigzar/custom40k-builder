/**
 * MACROCARID EXPLORATOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const macrocaridExplorator: Unit = {
  "name": "Macrocarid Explorator",
  "models": [
    {
      "name": "Macrocarid Explorator",
      "points": 408,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "7",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "3",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Macrocarid Explorator is equipped with: 2 Lascannons; Mauler bolt cannon.",
  "weapons": [
    {
      "name": "Conversion beamer - Short range",
      "range": "0\" - 24\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Conversion beamer - Mid range",
      "range": "24\" - 48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Conversion beamer - Long range",
      "range": "48\" - 72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Graviton imploder",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-4",
      "d": "1",
      "abilities": "Barrage, Grav, Graviton"
    },
    {
      "name": "Lascannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Mauler bolt cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
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
    },
    {
      "name": "Rad engine",
      "range": "9\"",
      "type": "Assault 4",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "Flames, Decimate"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin-linked lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin-linked mauler bolt cannon",
      "range": "24\"",
      "type": "Heavy 8",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin-linked rad cleanser",
      "range": "9\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Decimate"
    },
    {
      "name": "Twin-linked plasma fusil - Standard",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin-linked plasma fusil - Overheating",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Volkite culverin",
      "range": "45\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Soul Burn(6+)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Mauler bolt cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin-linked rad cleanser",
          "points": 3
        },
        {
          "name": "Graviton imploder",
          "points": 4
        },
        {
          "name": "Multi-melta",
          "points": 5
        },
        {
          "name": "Volkite culverin",
          "points": 9
        },
        {
          "name": "Conversion beamer",
          "points": 25
        },
        {
          "name": "Lascannon",
          "points": 37
        },
        {
          "name": "Twin-linked plasma fusil",
          "points": 56
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap both lascannons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Rad engines",
          "points": -77
        },
        {
          "name": "2 Twin-linked mauler bolt cannons",
          "points": -10
        },
        {
          "name": "2 Twin-linked lascannons",
          "points": 138
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Vanguard",
    "Transport: This model has a transport capacity of 10 infantry models."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 408
};
