/**
 * PLASMACYTE — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const plasmacyte: Unit = {
  "name": "Plasmacyte",
  "models": [
    {
      "name": "Plasmacyte",
      "points": 15,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "-",
        "S": "4",
        "T": "5",
        "W": "1",
        "I": "-",
        "A": "-",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Plasmacyte is a character model and equipped with: -.",
  "weapons": [],
  "option_groups": [],
  "abilities": [
    "Command squad",
    "Infused Madness: At the start of any activation, roll 1D6 for each model in the unit that the Plasmacyte has joined. On each 1 or 2, the unit suffers one Mortal Wound. Models killed by this ability are removed from play and Reanimation Protocols cannot be used. All surviving models gain the special rules \"Decimate\", \"Lance(1)\" and \"Quick(1)\" for melee attacks until the start of their next activation. A Plasmacyte receives the same movement and deployment rules as the unit it joins. Can only affect <Necron> units. Each Plasmacyte may use this ability once per game.",
    "Servant: The unit cannot contest or hold mission objectives."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "default_size": 1,
  "min_cost": 15
};
