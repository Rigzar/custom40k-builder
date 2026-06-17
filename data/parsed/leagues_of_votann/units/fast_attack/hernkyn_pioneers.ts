/**
 * HERNKYN PIONEERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hernkynPioneers: Unit = {
  "name": "Hernkyn Pioneers",
  "models": [
    {
      "name": "Pioneer",
      "points": 54,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Theyn",
      "points": 59,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Bolt revolver; Gravitic concussion grenades; Magna-coil autocannon.",
  "weapons": [
    {
      "name": "Bolt revolver",
      "range": "9\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    },
    {
      "name": "HYLas rotary cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Ion beamer",
      "range": "18\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Beam"
    },
    {
      "name": "Magna-coil autocannon",
      "range": "24\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 3 models, one Hernkyn Pioneer may be equipped with",
      "constraint": {
        "type": "per_n",
        "per_n": 3,
        "count_per_n": 1
      },
      "choices": [
        {
          "name": "HYLas rotary cannon",
          "points": 47
        },
        {
          "name": "Ion beamer",
          "points": 47
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The whole unit may take one of these upgrades",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Multiwave comms array",
          "points": 2
        },
        {
          "name": "Pan spectral scanner",
          "points": 2
        },
        {
          "name": "Rollbar searchlight",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One model may be upgraded to a Theyn for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": "Theyn",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Void armor",
    "Weapon crew kin: Any model with a HYLas rotary cannon or Ion beamer gains +1 Wound and +1 Attack.",
    "Upgrades:",
    "Multiwave comms array: The unit may use the Ld value of a friendly Kâhl, if any is present and alive in the army.",
    "Pan spectral scanner: All weapons of the unit gain \"Sunder(1)\".",
    "Rollbar searchlight: The unit ignores the -1 to hit modifier for cover."
  ],
  "unit_type": "Jetbike",
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
  "slot": "Fast Attack",
  "default_size": 3,
  "min_cost": 162
};
