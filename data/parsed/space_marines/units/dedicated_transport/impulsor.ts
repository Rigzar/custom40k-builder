/**
 * IMPULSOR — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const impulsor: Unit = {
  "name": "Impulsor",
  "models": [
    {
      "name": "Impulsor",
      "points": 117,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "9",
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Impulsor is a single model and equipped with: 2 Fragstorm grenade launcher.",
  "weapons": [
    {
      "name": "Fragstorm grenade launcher",
      "range": "18\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Ironhail heavy stubber",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Ironhail skytalon array",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-air"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Bellicatus missile array (Frag)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Anti-air"
    },
    {
      "name": "Bellicatus missile array (Icarus rockets)",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Bellicatus missile array (Krak)",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ironhail heavy stubber",
          "points": 15
        },
        {
          "name": "Multi-melta",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the 2 Fragstorm grenade launcher",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Storm bolter",
          "points": 7
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with two of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Orbital vox relay",
          "points": 5
        },
        {
          "name": "Ironhail skytalon array",
          "points": 31
        },
        {
          "name": "Shield dome",
          "points": 32
        },
        {
          "name": "Bellicatus missile array",
          "points": 41
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Fire hatches(6)",
    "Orbital vox relay: Gain a +1 bonus to your rolls in the Reinforcement phase.",
    "Shield dome: The model gains a 5+ invulnerability save.",
    "Transport: This model has a transport capacity of 6 infantry models, excluding models in Terminator armor."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 117
};
