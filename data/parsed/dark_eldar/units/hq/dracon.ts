/**
 * DRACON — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const dracon: Unit = {
  "name": "Dracon",
  "models": [
    {
      "name": "Dracon",
      "points": 42,
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
        "A": "3",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Archon",
      "points": 57,
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
        "A": "4",
        "LD": "9",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Dracon is equipped with: Plasma grenade.",
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
      "header": "One Dracon per army can be upgraded to an Archon for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Archon",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Power through Pain",
    "Deception: After all units have been placed in the Deployment phase, the Dracon may remove and redeploy one of his units.",
    "Archon: Another unit may be redeployed."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [
    "Kabal"
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
  "min_cost": 42
};
