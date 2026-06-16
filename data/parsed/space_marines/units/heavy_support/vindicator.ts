/**
 * VINDICATOR — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const vindicator: Unit = {
  "name": "Vindicator",
  "models": [
    {
      "name": "Vindicator",
      "points": 373,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "11",
        "REAR": "10",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Vindicator is a single model and equipped with: Demolisher cannon.",
  "weapons": [
    {
      "name": "Demolisher cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(4), Barrage, Tank hunter"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can be equipped with an additional Storm bolter for +11 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 11,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with a Siege shield for +15 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Siege shield: The model automatically passes tests for difficult terrain and is not slowed down by it. Additionally, attacks from the front always treat the model as being in cover."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 373
};
