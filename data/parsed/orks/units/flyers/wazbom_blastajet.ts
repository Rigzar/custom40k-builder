/**
 * WAZBOM BLASTAJET — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const wazbomBlastajet: Unit = {
  "name": "Wazbom Blastajet",
  "models": [
    {
      "name": "Blastajet",
      "points": 163,
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
  "equipped_with": "A Blastajet is equipped with: Smasha gun.",
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
      "name": "Big zzappa",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Explosive"
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
      "name": "Stikkbomb flinga",
      "range": "12\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Bomb, Explosive"
    },
    {
      "name": "Smasha gun",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Explosive, Grav"
    },
    {
      "name": "Traktor kannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "3",
      "abilities": "AT(2), Anti-air, Traktor"
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
      "name": "Twin-linked kustom mega-kannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Barrage, Overheating"
    },
    {
      "name": "Twin-linked tellyport mega-blasta",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1), Explosive, Tellyported"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the smasha gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "traktor kannon",
          "points": 6
        },
        {
          "name": "big zzappa",
          "points": 16
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
          "name": "two Grot bomms",
          "points": 68
        },
        {
          "name": "Twin-linked tellyport mega-blasta",
          "points": 110
        },
        {
          "name": "Twin-linked kustom mega-kannon",
          "points": 143
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one mek gubbin",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Stikkbomb flinga",
          "points": 7
        },
        {
          "name": "Wazbom Force Field",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May take one defensive turret",
      "constraint": {
        "type": "one"
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
      "choices": [
        { "name": "Da Booma", "points": 25 },
        { "name": "More Dakka", "points": 15 },
        { "name": "Press the Button", "points": 10 },
        { "name": "Shokka Hull", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Waaagh!",
    "Grot-guided: This weapon is fired with a BS of 4+ and ignores cover. Enemy targets in cover do not gain an armor bonus, and the firer suffers no hit penalty.",
    "Grot Gunner: A weapon with a Grot gunner is fired with a BS of 4+.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation.",
    "Tellyported: Any To Wound roll of a 6 made with this weapon inflicts 1 Mortal Wound. If this weapon rolls a 6 for armour penetration, it causes a penetrating hit, regardless of whether the armour penetration result was higher than the target’s armour value or not.",
    "Traktor: Attacks with this weapon against vehicles receive an additional +1 bonus on hit rolls.",
    "Wazbom Force Field: A Blastajet equipped with a Wazbom Force Field gains the \"Warded\" ability against ranged attacks."
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
  "min_cost": 163
};
