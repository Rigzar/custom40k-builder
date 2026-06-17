/**
 * BATTLE FORTRESS — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const battleFortress: Unit = {
  "name": "Battle Fortress",
  "models": [
    {
      "name": "Battle Fortress",
      "points": 280,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "5+",
        "S": "8",
        "FRONT": "14",
        "SIDE": "13",
        "REAR": "11",
        "I": "3",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Battle Fortress is equipped with: -.",
  "weapons": [
    {
      "name": "Big lobba",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Indirect"
    },
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
      "abilities": "AT(3), Explosive"
    },
    {
      "name": "Deff kannon",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Colossal blast, Tank hunter"
    },
    {
      "name": "Flakka gunz",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-air, Explosive, Sunder(1)"
    },
    {
      "name": "Gigashoota",
      "range": "48\"",
      "type": "Heavy 18",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Deflagrate(6+)"
    },
    {
      "name": "Grot bomm",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo (1), AT(2), Barrage, Indirect, Grot-guided"
    },
    {
      "name": "Kannon - Frag",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Kannon - Shell",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2)"
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
      "name": "Lifta-droppa",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Armorbane, Explosive, Grav, Lifta"
    },
    {
      "name": "Lobba",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
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
      "name": "Supa-lobba",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Colossal Blast, Indirect"
    },
    {
      "name": "Supa-kannon",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Supa rokkit",
      "range": "120\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Ammo(1), AT(2), Barrage"
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
      "abilities": "AT(2)"
    },
    {
      "name": "Zzap gun",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "26-12",
      "d": "2-1",
      "abilities": "AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with one big gun",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gigashoota",
          "points": 96
        },
        {
          "name": "Deff kannon",
          "points": 264
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "If the Battle Fortress does not have a big gun, it must be equipped with three of the following weapons",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Lobba",
          "points": 11
        },
        {
          "name": "Kannon",
          "points": 16
        },
        {
          "name": "Zzap gun",
          "points": 20
        },
        {
          "name": "Big lobba",
          "points": 24
        },
        {
          "name": "Killkannon",
          "points": 33
        },
        {
          "name": "Flakka gunz",
          "points": 40
        },
        {
          "name": "Big zzappa",
          "points": 53
        },
        {
          "name": "Supa-lobba",
          "points": 63
        },
        {
          "name": "Supa-kannon",
          "points": 68
        },
        {
          "name": "Lifta-droppa",
          "points": 81
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to six of the following weapons",
      "constraint": {
        "type": "fixed_max",
        "max": 6
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 12
        },
        {
          "name": "Rokkit launcha",
          "points": 16
        },
        {
          "name": "Skorcha",
          "points": 22
        },
        {
          "name": "Twin-linked big shoota",
          "points": 23
        },
        {
          "name": "Twin-linked rokkit launcha",
          "points": 31
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to three Supa rokkits for +23 points each",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to three Grot bomms for +34 points each",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Open, Waaagh!",
    "Grot-guided: This weapon is fired with a BS of 4+ and ignores cover. Enemy targets in cover do not gain an armor bonus, and the firer suffers no hit penalty.",
    "Lifta: When this weapon scores a hit on a vehicle, the Battlewagon's controlling player may move the target anywhere within D6\" of its starting location that is not within 1\" of another model. Then resolve the rest of the attack.",
    "Transport: This model has a transport capacity of 30 infantry models. This transport capacity is reduced by 10 models for each Supa-lobba, Supa-kannon, or Lifta-droppa the Battle Fortress is equipped with. If this model has a big gun, it has a transport capacity of 12 infantry models.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Big Kaboom! The vehicle explodes with a radius of 12\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then execute Big Kaboom!; the vehicle stops at the first unit (friendly or enemy!) instead of moving the distance rolled, and on a hit symbol the controlling player decides the direction. 5-6: Kerrunch! Passengers must disembark and receive no damage; the vehicle remains as a wreck. If the vehicle has been immobilized, the controlling player may roll on this table with any command during their next activation and apply the result."
  ],
  "unit_type": "Super-heavy Vehicle",
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
  "min_cost": 280
};
