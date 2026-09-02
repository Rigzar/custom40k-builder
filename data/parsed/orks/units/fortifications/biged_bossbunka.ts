/**
 * BIG'ED BOSSBUNKA — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bigedBossbunka: Unit = {
  "name": "Big'ed Bossbunka",
  "models": [
    {
      "name": "Big'ed Bossbunka",
      "points": 192,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "5+",
        "S": "-",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "12",
        "I": "-",
        "A": "-",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Big'ed Bossbunka is equipped with: Big shoota; Gaze of Gork",
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
      "name": "Gaze of Gork - Squint",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Beam, Flames"
    },
    {
      "name": "Gaze of Gork - Glare",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Beam, Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with up to three additional Big shootas for +12 points each.",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Big shoota",
          "points": 12
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
        { "name": "More Dakka", "points": 15, "effect": { "grants_abilities": ["More Dakka: Roll 1D6 when the unit is activated. On a 4+, the unit may fire an additional shot with a single weapon. Vehicle only."] } },
        { "name": "Press the Button", "points": 10, "effect": { "grants_abilities": ["Press the Button: Roll a die at the start of the model's activation. Vehicle only.\n1-2: The model suffers a glancing hit.\n3-4: The model receives the special rule \"Deflagrate(5+)\" for all weapons until the end of the battle round.\n5-6: The model receives the special rule \"Armor piercing(5+)\" for all weapons until the end of the battle round."] } },
        { "name": "Shokka Hull", "points": 5, "effect": { "grants_abilities": ["Shokka Hull: Attackers receive an automatic hit with S:4 AP:0 D:1 for each hit in the melee. Vehicle only."] } },
        { "name": "Eavy armour cabin", "points": 10, "effect": { "grants_abilities": ["Eavy armour cabin: Passengers receive the benefit of light cover. Transport vehicle only."] } },
        { "name": "Squig-hide Tyres", "points": 5, "effect": { "grants_abilities": ["Squig-hide Tyres: The model ignores temporary engine damage. Non-walker or aircraft vehicle only."] } }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Dakka Dakka Dakka, Open, Waaagh!",
    "Transport: This model has a transport capacity of 10 infantry models.",
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
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 192
};
