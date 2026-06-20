/**
 * IRONSTRIDER BALLISTARII — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ironstriderBallistarii: Unit = {
  "name": "Ironstrider Ballistarii",
  "models": [
    {
      "name": "Ballistarii",
      "points": 151,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "4",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bionics; Twin cognis autocannon.",
  "weapons": [
    {
      "name": "Twin cognis autocannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Cognis"
    },
    {
      "name": "Twin cognis lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Cognis"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Twin cognis autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin cognis lascannon",
          "points": 85
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin cognis autocannon"]
    },
    {
      "header": "The unit may select one Doctrina Imperative.",
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
    "Canticles of the Omnissiah, Deflect, Squadron",
    "Bionics: The model receives a 6+ invulnerability save."
  ],
  "unit_type": "Bike, Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 151
};
