/**
 * STORM SPEEDER — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormSpeeder: Unit = {
  "name": "Storm Speeder",
  "models": [
    {
      "name": "Storm Speeder",
      "points": 255,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "2",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Storm Speeder is equipped with: Onslaught gatling cannon; 2 Fragstorm grenade launcher; Twin Icarus rocket pod.",
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
      "name": "Melta destroyer",
      "range": "24\"",
      "type": "Heavy 3",
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
      "name": "Stormfury missiles",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin Icarus rocket pod",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Twin ironhail autocannon",
      "range": "48\"",
      "type": "Heavy 6",
      "s": "7",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Hammerstrike missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Anti-air"
    },
    {
      "name": "Hammerstrike missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "May swap their Onslaught gatling cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Las-talon",
          "points": 37
        },
        {
          "name": "Melta destroyer",
          "points": 73
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap their 2 Fragstorm grenade launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Krakstorm grenade launcher",
          "points": 1
        },
        {
          "name": "Stormfury missiles",
          "points": 58
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap their Twin Icarus rocket pod",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin ironhail autocannon",
          "points": 3
        },
        {
          "name": "Hammerstrike missile launcher",
          "points": 17
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Deep Strike, Squadron"
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
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 255
};
