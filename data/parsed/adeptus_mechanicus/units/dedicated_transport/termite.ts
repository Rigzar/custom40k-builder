/**
 * TERMITE — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const termite: Unit = {
  "name": "Termite",
  "models": [
    {
      "name": "Termite",
      "points": 239,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Termite is a single model and equipped with: Meltacutters, 2 Storm bolters.",
  "weapons": [
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Meltacutters - Blast",
      "range": "12\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Meltacutters - Ram",
      "range": "-",
      "type": "Melee",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Armorbane"
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
      "name": "Twin-linked volkite charger",
      "range": "15\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Soul Burn(6+)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap both Storm bolters",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy flamer",
          "points": 5
        },
        {
          "name": "Twin-linked volkite charger",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Storm bolter"]
    }
  ],
  "abilities": [
    "Deep Strike",
    "Meltacutters: This model resolves Tank Shocks using the Meltacutters: Ram weapon profile.",
    "Subterranean Assault: Termites may always choose to start the game as Reserves and be set up via Deep Strike, even if the played mission does not allow reinforcements and/or Deep Strike.",
    "Transport: This model has a transport capacity of 12 infantry models."
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
  "min_cost": 239
};
