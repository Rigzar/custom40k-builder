/**
 * DOOMSDAY ARK — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const doomsdayArk: Unit = {
  "name": "Doomsday Ark",
  "models": [
    {
      "name": "Doomsday Ark",
      "points": 417,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Doomsday Ark is a single model and equipped with: Doomsday cannon; two Gauss flayer arrays.",
  "weapons": [
    {
      "name": "Gauss flayer array",
      "range": "24\"",
      "type": "Rapid Fire 5",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Doomsday cannon - Low energy",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Doomsday cannon - High energy",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-6",
      "d": "5",
      "abilities": "AT(4)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-Grav",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Power surge: The Doomsday cannon's \"High energy\" profile may only be used with a \"Stand & Shoot\" command.",
    "Quantum shielding: The model increases its armor values by +2 on each side, up to a maximum of 14. If it suffers a penetrating hit, it loses this bonus until the next Reinforcement phase."
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 417
};
