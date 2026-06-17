/**
 * CORONUS GRAV-CARRIER — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const coronusGravCarrier: Unit = {
  "name": "Coronus Grav-carrier",
  "models": [
    {
      "name": "Coronus Grav-carrier",
      "points": 376,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "2+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "12",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Coronus Grav-carrier is equipped with: Twin arachnus blaze cannon; Twin lastrum bolt cannon.",
  "weapons": [
    {
      "name": "Twin arachnus blaze cannon — Beam",
      "range": "-",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Beam, Tank hunter"
    },
    {
      "name": "Twin arachnus blaze cannon — Burst",
      "range": "-",
      "type": "Heavy 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lastrum bolt cannon",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "The unit can gain a Veteran ability.",
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
    "Anti-Grav, Shield Host",
    "Flare Shielding: The model has a 5+ invulnerability save. Enemy attacks receive a -1 AT penalty (to a minimum of 1).",
    "Transport: This model has a transport capacity of 12 infantry models."
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 376
};
