/**
 * KATAPHRON BREACHERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kataphronBreachers: Unit = {
  "name": "Kataphron Breachers",
  "models": [
    {
      "name": "Breacher",
      "points": 71,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Arc claw; Heavy arc rifle.",
  "weapons": [
    {
      "name": "Arc claw",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Heavy arc rifle",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Haywire"
    },
    {
      "name": "Hydraulic claw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Slow(-2)"
    },
    {
      "name": "Torsion cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(2), Graviton"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Arc claw",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Hydraulic claw",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Arc claw"]
    },
    {
      "header": "Any model may swap their Heavy arc rifle",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Torsion cannon",
          "points": 42
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy arc rifle"]
    }
  ],
  "abilities": [
    "Massive(1), Monotask, Unyielding",
    "Bionics: This model receives a 6+ invulnerability save."
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
  "default_size": 3,
  "min_cost": 213
};
