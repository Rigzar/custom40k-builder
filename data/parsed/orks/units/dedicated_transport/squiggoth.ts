/**
 * SQUIGGOTH — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const squiggoth: Unit = {
  "name": "Squiggoth",
  "models": [
    {
      "name": "Squiggoth",
      "points": 185,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "5+",
        "S": "10",
        "T": "7",
        "W": "6",
        "I": "2",
        "A": "4",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Squiggoth is equipped with: Huge tusks; Lobba.",
  "weapons": [
    {
      "name": "Huge tusks",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(3)"
    },
    {
      "name": "Kannon - Frag",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage"
    },
    {
      "name": "Kannon - Shell",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Explosive"
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
      "header": "May swap the Lobba",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Zzap gun",
          "points": 9
        },
        {
          "name": "Kannon",
          "points": 33
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Open, <Squig>, <Wildork>",
    "Enraged demise: The model explodes like a vehicle upon losing its last Wound.",
    "Transport: This model has a transport capacity of 15 infantry models.",
    "Wildork: The model receives the <Wildork> keyword and a 6+ invulnerability saving throw. Melee hit rolls against vehicles or monstrous creatures receive a +1 bonus and the \"Lance(1)\" ability."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 185
};
