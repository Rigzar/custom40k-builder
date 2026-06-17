/**
 * ORKANAUT — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const orkanaut: Unit = {
  "name": "Orkanaut",
  "models": [
    {
      "name": "Orkanaut",
      "points": 397,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "7",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "12",
        "I": "3",
        "A": "3",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Orkanaut is equipped with: Klaw of Gork (or possibly Mork); Skorcha; two Twin-linked big shootas; Twin-linked rokkit launcha.",
  "weapons": [
    {
      "name": "Big zzappa",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Deffstorm mega-shoota",
      "range": "36\"",
      "type": "Heavy 10",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Deflagrate(6+)"
    },
    {
      "name": "Killkannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Barrage"
    },
    {
      "name": "Klaw of Gork (or possibly Mork) - Strike",
      "range": "-",
      "type": "Melee",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Klaw of Gork (or possibly Mork) - Sweep",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Flurry(3)"
    },
    {
      "name": "Kustom mega-blasta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    },
    {
      "name": "Kustom mega-kannon",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Barrage, Overheating"
    },
    {
      "name": "Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(1)"
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
      "name": "Supa-skorcha",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Twin-linked big shoota",
      "range": "36\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin-linked rokkit launcha",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Must take a big gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Killkannon",
          "points": 33
        },
        {
          "name": "Deffstorm mega-shoota",
          "points": 48
        },
        {
          "name": "Big zzappa",
          "points": 52
        },
        {
          "name": "Supa-skorcha",
          "points": 53
        },
        {
          "name": "Kustom mega-kannon",
          "points": 72
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the skorcha",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Kustom mega-blasta",
          "points": 25
        }
      ],
      "replaces": [
        "Skorcha"
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May take a Junka force field for +45 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 45,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Waaagh!",
    "Junka force field: A model equipped with a Junka Force Field and any friendly unit entirely within 9\" gains the \"Warded\" ability against ranged attacks.",
    "Transport: This model has a transport capacity of 6 infantry models.",
    "Ramshackle: Roll D6 after the vehicle loses its last Hull Point — 1-3: Big Kaboom! The vehicle explodes with a 12\" radius. 4-6: Kareen! Move the vehicle 3D6\" in a random direction and then perform Big Kaboom!; on a hit symbol the controlling player decides the direction. If the vehicle has been reduced to 0\" Movement permanently, the controlling player may roll on this table with any command during their next activation and apply the result."
  ],
  "unit_type": "Walker",
  "keywords": [
    "Lord of War"
  ],
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
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 397
};
