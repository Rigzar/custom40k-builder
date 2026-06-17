/**
 * CRYPTEK — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const cryptek: Unit = {
  "name": "Cryptek",
  "models": [
    {
      "name": "Cryptek",
      "points": 30,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Dynasty Scion",
      "points": 45,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Cryptek is equipped with: -.",
  "weapons": [],
  "option_groups": [
    {
      "header": "May be upgraded to one of the following. Each specialisation is unique per army",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Chronomancer",
          "points": 15
        },
        {
          "name": "Dynasty Scion",
          "points": 15
        },
        {
          "name": "Plasmancer",
          "points": 15
        },
        {
          "name": "Psychomancer",
          "points": 15
        },
        {
          "name": "Technomancer",
          "points": 15
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad, Regeneration(1)",
    "Royal Court: If an Overlord is present, up to four Crypteks can be chosen that do not occupy an HQ slot. If a Lord is present, up to two Crypteks can be chosen that do not occupy an HQ slot.",
    "Chronomancer: The model additionally grants +1 Initiative to itself and its attached unit.",
    "Dynasty Scion: The model gains an improved profile (see above) and has access to Lord equipment in the Armory, instead of Cryptek.",
    "Plasmancer: Automatic wounds caused by equipment from this model trigger on a 3+.",
    "Psychomancer: Once per turn, an enemy unit within 18\" suffers a cumulative -1 penalty to its Leadership until the next Rally phase.",
    "Technomancer: Once per turn, one Reanimation Protocol roll for a unit within 6\" is automatically successfull."
  ],
  "unit_type": "Character Model, Infantry, Cryptek, Necron",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 30
};
