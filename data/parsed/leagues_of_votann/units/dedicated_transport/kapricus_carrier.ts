/**
 * KAPRICUS CARRIER — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kapricusCarrier: Unit = {
  "name": "Kapricus Carrier",
  "models": [
    {
      "name": "Kapricus Carrier",
      "points": 156,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "3",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Kapricus Carrier is equipped with: Magna-coil autocannon; Twin magna-coil autocannon.",
  "weapons": [
    {
      "name": "Magna-coil autocannon",
      "range": "24\"",
      "type": "Assault 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin magna-coil autocannon",
      "range": "24\"",
      "type": "Assault 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-grav, Eye of the Ancestors, Void armor",
    "Scanner Uplinks: All ranged weapons of the model gain the \"Suppression\" ability.",
    "Transport: This model has a transport capacity of 5 infantry models, excluding models in Exo-armor and Exo-frames."
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 156
};
