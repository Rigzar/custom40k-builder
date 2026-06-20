/**
 * EXORCIST — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const exorcist: Unit = {
  "name": "Exorcist",
  "models": [
    {
      "name": "Exorcist",
      "points": 253,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "10",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Exorcist is equipped with: Exorcist missile launcher; Heavy bolter.",
  "weapons": [
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Exorcist missile launcher - Conflagration rockets",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-air, Explosive, Indirect, Seeking"
    },
    {
      "name": "Exorcist missile launcher - Exorcist missiles",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Anti-air, Indirect"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Acts of Faith, Shield of Faith"
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 253
};
