/**
 * SLOPPITY BILEPIPER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sloppityBilepiper: Unit = {
  "name": "Sloppity Bilepiper",
  "models": [
    {
      "name": "Sloppity Bilepiper",
      "points": 55,
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
  "equipped_with": "A Sloppity Bilepiper is equipped with: Marotter.",
  "weapons": [
    {
      "name": "Marotter",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(2+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Deepstrike, Daemon, Daemonic instability, Mark of Nurgle, Terrifying(-1)",
    "Entourage: For each Greater Daemon of the same Chaos god, up to two units with this rule can be can be chosen that do not occupy an HQ slot.",
    "Herald: Up to two units with this rule can be taken as a single HQ choice.",
    "Disease of Mirth: The model and its attached unit roll an additional die for Leadership tests and discard the highest. Whenever an enemy unit within 14\" fails a Leadership test, one model in that unit is slain. Character models and Monstrous Creatures are unaffected.",
    "Jolly Gutpipes: During the activation, select a friendly Mark of Nurgle unit that is within 7\" of the Sloppity Bilepiper. All models in that unit move +1\" until the end of their next activation."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 55
};
