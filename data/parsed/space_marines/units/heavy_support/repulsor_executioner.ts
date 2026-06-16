/**
 * REPULSOR EXECUTIONER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const repulsorExecutioner: Unit = {
  "name": "Repulsor Executioner",
  "models": [
    {
      "name": "Repulsor Executioner",
      "points": 545,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "7",
        "FRONT": "14",
        "SIDE": "14",
        "REAR": "14",
        "I": "4",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Repulsor Executioner is a single model and equipped with: 2 Fragstorm grenade launcher; Heavy onslaught gatling cannon; Laser destroyer; 2 Storm bolter; Twin Icarus Ironhail heavy stubber; Twin heavy bolter.",
  "weapons": [
    {
      "name": "Fragstorm grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Heavy onslaught gatling cannon",
      "range": "30\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Icarus rocket pod",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Laser destroyer",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "4",
      "abilities": "AT(4), Lance(1), Tank hunter"
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
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin Icarus Ironhail heavy stubber",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-air"
    },
    {
      "name": "Macro plasma incinerator (Standard)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Macro plasma incinerator (Overheating)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Explosive, Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "May swap their Laser destroyer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Macro plasma incinerator",
          "points": 63
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ironhail heavy stubber",
          "points": 15
        },
        {
          "name": "Multi-melta",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Icarus rocket pod",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-grav",
    "Transport: This model has a transport capacity of 6 infantry models."
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
  "min_cost": 545
};
