/**
 * ETHEREAL GUARD — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const etherealGuard: Unit = {
  "name": "Ethereal Guard",
  "models": [
    {
      "name": "Ethereal Guard",
      "points": 18,
      "min": 2,
      "max": 4,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each Ethereal Guard is equipped with: Equalisers.",
  "weapons": [
    {
      "name": "Equalisers",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(1), Unwieldy"
    },
    {
      "name": "Honour blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Honour stave",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "1 unit of Ethereal Guard can be taken for each Ethereal. Does not occupy an HQ slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model can swap the Equalisers",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Honour blade",
          "points": 0
        },
        {
          "name": "Honour stave",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Equalisers"]
    }
  ],
  "abilities": [
    "Bodyguard, Command squad, Supporting Fire",
    "Honor Guard: Ethereal Guards do not prevent an Ethereal from joining another unit. They will go with him!"
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": true,
  "slot": "HQ",
  "default_size": 2,
  "min_cost": 36
};
