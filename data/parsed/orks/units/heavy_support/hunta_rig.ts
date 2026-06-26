/**
 * HUNTA RIG — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const huntaRig: Unit = {
  "name": "Hunta Rig",
  "models": [
    {
      "name": "Hunta Rig",
      "points": 290,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "11",
        "I": "3",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hunta Rig is equipped with: 'Eavy lobba; Savage horns and hooves; Stikka kannon.",
  "weapons": [
    {
      "name": "Stikka kannon",
      "range": "12\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Add +1 for to hit rolls against Monstrous creatures and Vehicles"
    },
    {
      "name": "Eavy lobba",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Indirect"
    },
    {
      "name": "Savage horns and hooves",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "Flurry(3)"
    }
  ],
  "option_groups": [
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
        { "name": "Eavy armour cabin", "points": 10 },
        { "name": "Squig-hide Tyres", "points": 5 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Waaagh!, <Squig>, <Wildork>",
    "Snagged: Vehicles and Monstrous creatures hit by the Stikka kannon can't move more than 6\" away from the Hunta Rig until it is activated again.",
    "Transport: This model has a transport capacity of 15 infantry models.",
    "Wildork: The model receives the <Wildork> keyword and a 6+ invulnerability saving throw. Melee hit rolls against vehicles or monstrous creatures receive a +1 bonus and the \"Lance(1)\" ability.",
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
  "min_cost": 290
};
