/**
 * TANKBUSTAS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tankbustas: Unit = {
  "name": "Tankbustas",
  "models": [
    {
      "name": "Tankbusta",
      "points": 17,
      "min": 5,
      "max": 15,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "2",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Nob",
      "points": 33,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Smasha hamma; Tankbusta bomb.",
  "weapons": [
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
      "name": "Bomb squig",
      "range": "18\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Ammo(1)"
    },
    {
      "name": "Rokkit hamma",
      "range": "-",
      "type": "Melee",
      "s": "10",
      "ap": "-3",
      "d": "3",
      "abilities": "Ammo(1), AT(3), Armorbane, Slow(-3), Unwieldy"
    },
    {
      "name": "Smasha hamma",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2), Unwieldy"
    },
    {
      "name": "Tankbusta bomb",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Armorbane"
    }
  ],
  "option_groups": [
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Wildork",
          "points": 2
        },
        {
          "name": "'Eavy armour",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "The squad may receive up to three Bomb squigs for +8 points each.",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Bomb squig",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Up to two Tankbusta may swap their Smasha hammas",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Rokkit hamma",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Smasha hamma"]
    },
    {
      "header": "All remaining Tankbusta may swap their Smasha hammas",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Rokkit launcha",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Smasha hamma"]
    },
    {
      "header": "One Tankbusta may be upgraded to a Nob for +16 points and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 16,
      "variant_link": "Nob",
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
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!",
    "Bomb squig: During activation, a Kommando can release a Bomb squig. Roll 1D6. On a 2+, the Bomb squig automatically hits the nearest enemy unit within 18\". On a 1, it automatically hits the nearest friendly unit within 18\". Vehicles are favored in both cases.",
    "Glory hogs: The model receives +1 to hit rolls against vehicles and monstrous creatures when using a \"Move & Shoot\" or \"Stand & Shoot\" command. If a vehicle is in range at the start of the activation, it must shoot at it or attack in melee. Splitting fire is not allowed."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
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
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 85
};
