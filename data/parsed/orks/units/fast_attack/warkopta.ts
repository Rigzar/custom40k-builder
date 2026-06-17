/**
 * WARKOPTA — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const warkopta: Unit = {
  "name": "Warkopta",
  "models": [
    {
      "name": "Warkopta",
      "points": 183,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12",
        "WS": "-",
        "BS": "5+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Warkopta is equipped with: Twin-linked deffgun; big shoota with grot gunner.",
  "weapons": [
    {
      "name": "Big shoota",
      "range": "36\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kustom mega-blasta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive, Overheating"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Skorcha",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Twin-linked supa-shoota",
      "range": "36\"",
      "type": "Assault 8",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Deflagrate(6+)"
    },
    {
      "name": "Twin-linked Deffgun - Shooty",
      "range": "48\"",
      "type": "Assault 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Looted"
    },
    {
      "name": "Twin-linked Deffgun - Beamy",
      "range": "48\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Looted"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the twin-linked deffgun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "twin-linked supa-shoota",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the big shoota with grot gunner",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Kustom mega-blasta with grot gunner",
          "points": 4
        },
        {
          "name": "Skorcha",
          "points": 5
        },
        {
          "name": "Rokkit launcha with grot gunner",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can get one Kustom job.",
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
    "Anti-Grav, Dakka Dakka Dakka, Fast, Open, Waaagh!",
    "Transport: This model has a transport capacity of 10 infantry models.",
    "Grot Gunner: A weapon with a Grot gunner is fired with a BS of 4+.",
    "Looted: When a unit shoots with this weapon, before selecting a target roll a D6. On a result of 1-3, all deffguns in the unit must use the \"Shooty\" profile. On a result of 4-6, they must all use the \"Beamy\" profile.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation."
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
  "min_cost": 183
};
