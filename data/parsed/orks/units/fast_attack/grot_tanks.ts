/**
 * GROT TANKS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const grotTanks: Unit = {
  "name": "Grot Tanks",
  "models": [
    {
      "name": "Grot Tank",
      "points": 54,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "4+",
        "S": "4",
        "FRONT": "9",
        "SIDE": "9",
        "REAR": "9",
        "I": "3",
        "A": "2",
        "HP": "1"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Skorcha.",
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
      "name": "Grotzooka",
      "range": "18\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
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
      "header": "Every model may swap their Skorcha",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 0
        },
        {
          "name": "Kustom mega-blasta",
          "points": 2
        },
        {
          "name": "Rokkit launcha",
          "points": 6
        },
        {
          "name": "Grotzooka",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Skorcha"]
    },
    {
      "header": "Can get one Kustom job.",
      "constraint": {
        "type": "one"
      },
      "choices": [
        { "name": "Da Booma", "points": 25 },
        { "name": "More Dakka", "points": 15 },
        { "name": "Press the Button", "points": 10 },
        { "name": "Shokka Hull", "points": 5 },
        { "name": "Squig-hide Tyres", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Squadron",
    "Full speed ahead!: The model can be moved an additional D6\" each time it is activated. If the result is a 1, it suffers a permanent engine damage.",
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
  "min_cost": 54
};
