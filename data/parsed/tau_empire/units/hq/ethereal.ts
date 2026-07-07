/**
 * ETHEREAL — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';
import { TAU_DRONE_CHOICES } from '../../drone_choices';

export const ethereal: Unit = {
  "name": "Ethereal",
  "models": [
    {
      "name": "Ethereal",
      "points": 49,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "9",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Revered Ethereal",
      "points": 64,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "3",
        "A": "3",
        "LD": "10",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "An Ethereal is a single character model and equipped with: Equalisers.",
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
      "header": "Can swap the Equalisers",
      "constraint": {
        "type": "one"
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
      "is_unique_per_army": false
    },
    {
      "header": "One Ethereal per army can be upgraded to a Revered Ethereal for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Revered Ethereal",
      "is_unique_per_army": true
    },
    {
      "header": "May buy a Drone controller for +0 points and up to two Tau Drones in any combination.",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": TAU_DRONE_CHOICES,
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad, Supporting Fire",
    "Failure is not an option: Friendly units within 12\" may use the Ethereal's Leadership value.",
    "Serene unifier: The model can invoke 1 invocation per turn. An invocation is successfully invoked on a roll of 3+. It knows all the powers from the list of Invocations of the Ethereals. Each Ethereal can only use each power once per battle round.",
    "Revered Ethereal: The model can invoke 1 additional invocation per turn."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "is_priest": true,
  "has_armory_access": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 49
};
