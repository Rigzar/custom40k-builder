/**
 * GLADIATOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const gladiator: Unit = {
  "name": "Gladiator",
  "models": [
    {
      "name": "Gladiator",
      "points": 281,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "11",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Gladiator is a single model and equipped with: Twin Heavy onslaught gatling cannon; 2 Fragstorm grenade launcher.",
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
      "name": "Icarus rocket pod",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Ironhail heavy stubber",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Laser destroyer",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "4",
      "abilities": "AT(4), Tank hunter"
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
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Tempest Boltgun",
      "range": "30\"",
      "type": "Rapid Fire 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin Heavy onslaught gatling cannon",
      "range": "30\"",
      "type": "Heavy 12",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Twin Las-talon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "9",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap their Twin Heavy onslaught gatling cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Laser destroyer",
          "points": 36
        },
        {
          "name": "Twin Las-talon",
          "points": 43
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap their two Fragstorm grenade launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Storm bolter",
          "points": 7
        },
        {
          "name": "two Tempest Boltgun",
          "points": 33
        },
        {
          "name": "two Multi-melta",
          "points": 59
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
    "Anti-grav"
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
  "min_cost": 281
};
