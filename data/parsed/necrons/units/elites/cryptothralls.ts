/**
 * CRYPTOTHRALLS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const cryptothralls: Unit = {
  "name": "Cryptothralls",
  "models": [
    {
      "name": "Cryptothrall",
      "points": 45,
      "min": 2,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Scouring eye; Scythed limbs.",
  "weapons": [
    {
      "name": "Scouring eye",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Scythed limbs",
      "range": "-",
      "type": "Melee",
      "s": "T",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every Cryptek you may select a unit of Technothralls that take up no Elite-slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bodyguard, Regeneration(1)",
    "Servant: The unit cannot contest or hold mission objectives.",
    "Systematic Vigour: If a Cryptek is attached to the unit, each Technothrall gains a bonus of +1 on to hit rolls. Technothralls do not prevent a Cryptek from joining another unit."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
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
  "default_size": 2,
  "min_cost": 90
};
