/**
 * CALADIUS GRAV-TANK — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const caladiusGravTank: Unit = {
  "name": "Caladius Grav-Tank",
  "models": [
    {
      "name": "Caladius Grav-Tank",
      "points": 378,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "2+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "12",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Caladius Grav-Tank is equipped with: Twin lastrum bolt cannon; Twin iliastus accelerator cannon.",
  "weapons": [
    {
      "name": "Twin arachnus heavy blaze cannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Twin lastrum bolt cannon",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin iliastus accelerator cannon",
      "range": "48\"",
      "type": "Assault 4",
      "s": "8",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+), AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap their Twin iliastus accelerator cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin arachnus heavy blaze cannon",
          "points": 88
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Shield Host",
    "Custodes Atomantic Shielding: The model has a 5+ invulnerability save. Enemy attacks receive a -1 AT penalty (to a minimum of 1)."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
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
  "min_cost": 378
};
