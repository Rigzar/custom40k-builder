/**
 * REPULSOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const repulsor: Unit = {
  "name": "Repulsor",
  "models": [
    {
      "name": "Repulsor",
      "points": 394,
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
  "equipped_with": "A Repulsor is a single model and equipped with: Ironhail heavy stubber; 3 Fragstorm grenade launcher; Heavy onslaught gatling cannon; 2 Krakstorm grenade launcher; Twin heavy bolter.",
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
      "name": "Icarus Ironhail heavy stubber",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-air"
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
      "name": "Krakstorm grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Las-talon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3)"
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
      "name": "Onslaught gatling cannon",
      "range": "24\"",
      "type": "Heavy 5",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
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
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap their Heavy onslaught gatling cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Las-talon",
          "points": 21
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy onslaught gatling cannon"]
    },
    {
      "header": "May swap their Twin Heavy bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin lascannon",
          "points": 102
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin heavy bolter"]
    },
    {
      "header": "Can swap one Ironhail heavy stubber",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Onslaught gatling cannon",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Ironhail heavy stubber"]
    },
    {
      "header": "Can swap 2 Fragstorm grenade launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Storm bolters",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Fragstorm grenade launcher"]
    },
    {
      "header": "Can swap one Fragstorm grenade launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 3
        },
        {
          "name": "Icarus Ironhail heavy stubber",
          "points": 8
        },
        {
          "name": "Icarus rocket pod",
          "points": 27
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Fragstorm grenade launcher"]
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
    }
  ],
  "abilities": [
    "Anti-grav",
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
  "min_cost": 394
};
