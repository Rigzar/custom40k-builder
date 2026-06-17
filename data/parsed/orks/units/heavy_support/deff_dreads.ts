/**
 * DEFF DREADS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deffDreads: Unit = {
  "name": "Deff Dreads",
  "models": [
    {
      "name": "Deff Dread",
      "points": 176,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: 2 Dread klaws.",
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
      "name": "Dread klaw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(1)"
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
    }
  ],
  "option_groups": [
    {
      "header": "Every model must pick two weapons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 12
        },
        {
          "name": "Kustom mega-blasta",
          "points": 15
        },
        {
          "name": "Dread klaw",
          "points": 16
        },
        {
          "name": "Rokkit launcha",
          "points": 16
        },
        {
          "name": "Skorcha",
          "points": 22
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
    "Dakka Dakka Dakka, Squadron, Waaagh!",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation."
  ],
  "unit_type": "Walker",
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
  "min_cost": 176
};
