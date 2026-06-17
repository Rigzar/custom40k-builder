/**
 * SUCCUBUS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const succubus: Unit = {
  "name": "Succubus",
  "models": [
    {
      "name": "Succubus",
      "points": 23,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "6",
        "A": "4",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Master Succubus",
      "points": 38,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "6",
        "A": "5",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "equipped_with": "A Succubus is a single character model and equipped with: Plasma grenade.",
  "weapons": [
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "One Succubus per army can be upgraded to a Master Succubus for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Master Succubus",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Combat drugs, Deflect, Power through Pain, Parry",
    "Master Succubus: The model may select a second Combat drug."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Cult"
  ],
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
  "min_cost": 23
};
