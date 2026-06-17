/**
 * FIGHTA-BOMMER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fightaBommer: Unit = {
  "name": "Fighta-Bommer",
  "models": [
    {
      "name": "Fighta-bommer",
      "points": 149,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "F",
        "WS": "-",
        "BS": "5+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "3",
        "A": "2",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Fighta-bommer is equipped with: Twin-linked big shoota.",
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
      "name": "Boom bomm",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Bomb, Barrage"
    },
    {
      "name": "Bomm",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Ammo(1), Bomb, Barrage"
    },
    {
      "name": "Burna bomm",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Ammo(1), Bomb, Barrage, Seeking"
    },
    {
      "name": "Grot Bomm",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo (1), AT(2), Barrage, Grot-guided"
    },
    {
      "name": "Rokkit",
      "range": "36\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Anti-air"
    },
    {
      "name": "Skorcha missile",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Ammo(1), Explosive, Seeking"
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
      "name": "Twin-linked supa-shoota",
      "range": "36\"",
      "type": "Assault 8",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Deflagrate(6+)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the twin-linked big shoota",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "twin-linked supa-shoota",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one payload",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "two Boom bomms",
          "points": 22
        },
        {
          "name": "twin-linked big shoota",
          "points": 23
        },
        {
          "name": "twin-linked supa-shoota",
          "points": 34
        },
        {
          "name": "two twin-linked big shootas",
          "points": 46
        },
        {
          "name": "two twin-linked supa-shootas",
          "points": 67
        },
        {
          "name": "two Grot bomms",
          "points": 68
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one wing armament. If the fighta-bommer doesn't have a payload, it may take up to four wing armaments",
      "constraint": {
        "type": "fixed_max",
        "max": 4
      },
      "choices": [
        {
          "name": "two bomms",
          "points": 5
        },
        {
          "name": "two skorcha missiles",
          "points": 6
        },
        {
          "name": "two rokkits",
          "points": 7
        },
        {
          "name": "two burna bomms",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May take up to two defensive turrets",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Big shoota with Grot Gunner",
          "points": 17
        },
        {
          "name": "Twin-linked Big shoota with Grot Gunner",
          "points": 35
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
    "Dakka Dakka Dakka, Waaagh!",
    "Grot-guided: This weapon is fired with a BS of 4+ and ignores cover. Enemy targets in cover do not gain an armor bonus, and the firer suffers no hit penalty.",
    "Grot Gunner: A weapon with a Grot gunner is fired with a BS of 4+.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation."
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 149
};
