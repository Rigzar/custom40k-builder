/**
 * SPOILPOX SCRIVENER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const spoilpoxScrivener: Unit = {
  "name": "Spoilpox Scrivener",
  "models": [
    {
      "name": "Spoilpox Scrivener",
      "points": 56,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Spoilpox Scrivener is equipped with: Distended maw; Disgusting sneezes.",
  "weapons": [
    {
      "name": "Distended maw",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Poison(4+)"
    },
    {
      "name": "Disgusting sneezes",
      "range": "6\"",
      "type": "Pistol 3",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(4+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Deepstrike, Daemon, Daemonic instability, Mark of Nurgle, Terrifying(-1)",
    "Entourage: For each Greater Daemon of the same Chaos god, up to two units with this rule can be can be chosen that do not occupy an HQ slot.",
    "Herald: Up to two units with this rule can be taken as a single HQ choice.",
    "Keep Counting! Meet your Quota!: During the activation, select a friendly Mark of Nurgle unit that is within 7\" of the Spoilpox Scrivener. All models in that unit gain +1 to hit rolls."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 56
};
