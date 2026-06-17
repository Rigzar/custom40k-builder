/**
 * LORD — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const lord: Unit = {
  "name": "Lord",
  "models": [
    {
      "name": "Lord",
      "points": 115,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Overlord",
      "points": 130,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "5",
        "I": "4",
        "A": "4",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Lord is equipped with: -.",
  "weapons": [],
  "option_groups": [
    {
      "header": "One Lord per army can be upgraded to an Overlord for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Overlord",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Regeneration(1)",
    "My Will Be Done: Select one <Necron> unit during your Reinforcement phase. The unit gains the \"Fearless\" ability until the end of the current battle round.",
    "Overlord: An Overlord may use My Will Be Done a second time.",
    "Royal Court: If an Overlord is present, up to four Lords can be chosen that do not occupy an HQ slot.",
    "Royal Necrodermis: Reduces AP of enemy attacks by -1 (to a minimum of 0)."
  ],
  "unit_type": "Character Model, Infantry, Lord, Necron",
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
  "min_cost": 115
};
