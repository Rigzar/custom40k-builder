/**
 * BATTLEWAGON — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const battlewagon: Unit = {
  "name": "Battlewagon",
  "models": [
    {
      "name": "Battlewagon",
      "points": 260,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "5+",
        "S": "6",
        "FRONT": "14",
        "SIDE": "12",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Battlewagon is equipped with: -.",
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
      "abilities": "AT(2), Explosive"
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
      "abilities": "Colossal Blast, Indirect"
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
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Zzap gun",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "2D6",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with one of the following weapons",
      "constraint": {
        "type": "one"
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
          "name": "Big lobba",
          "points": 16
        },
        {
          "name": "Zzap gun",
          "points": 20
        },
        {
          "name": "Killkannon",
          "points": 25
        },
        {
          "name": "Flakka gunz",
          "points": 32
        },
        {
          "name": "Big zzappa",
          "points": 45
        },
        {
          "name": "Supa-lobba",
          "points": 59
        },
        {
          "name": "Supa-kannon",
          "points": 64
        },
        {
          "name": "Lifta-droppa",
          "points": 77
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with one of the following weapons",
      "constraint": {
        "type": "one"
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
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be equipped with up to four of the following weapons",
      "constraint": {
        "type": "fixed_max",
        "max": 4
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
    "Dakka Dakka Dakka, Open, Waaagh!",
    "Lifta: When this weapon scores a hit on a vehicle, the Battlewagon's controlling player may move the target anywhere within D6\" of its starting location that is not within 1\" of another model. Then resolve the rest of the attack.",
    "Transport: This model has a transport capacity of 20 infantry models. When equipped with Flakka gunz, a Big lobba, Killkannon, or Big Zzappa, it has a transport capacity of 12 infantry models. When equipped with a Supa-lobba, Supa-kannon, or Lifta-droppa, it has a transport capacity of 6 infantry models.",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 260
};
