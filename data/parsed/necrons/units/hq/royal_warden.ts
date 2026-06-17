/**
 * ROYAL WARDEN — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const royalWarden: Unit = {
  "name": "Royal Warden",
  "models": [
    {
      "name": "Royal Warden",
      "points": 86,
      "min": 1,
      "max": 1,
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
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Royal Warden is equipped with: Relic tesla carbine.",
  "weapons": [
    {
      "name": "Relic gauss blaster",
      "range": "30\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Relic tesla carbine",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla, AT(-1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap its Relic tesla carbine with a Relic gauss blaster for +8 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 8,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad, Regeneration(1)",
    "Royal Court: If an Overlord is present, up to four Royal Wardens can be chosen that do not occupy an HQ slot. If a Lord is present, up to two Royal Wardens can be chosen that do not occupy an HQ slot.",
    "Relentless March: The model and its attached unit may shoot “Rapid fire” weapons at full range with a \"Move & Shoot\" order and ignores the to hit penalty for \"Advance\" orders with \"Assault\" weapons."
  ],
  "unit_type": "Character Model, Infantry, Necron",
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
  "min_cost": 86
};
