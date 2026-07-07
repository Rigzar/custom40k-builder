/**
 * BLOODMASTER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const bloodmaster: Unit = {
  "name": "Bloodmaster",
  "models": [
    {
      "name": "Bloodmaster",
      "points": 73,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "4",
        "W": "3",
        "I": "5",
        "A": "4",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Bloodmaster is equipped with: Blade of blood.",
  "weapons": [
    {
      "name": "Blade of blood",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Deadly(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Deepstrike, Daemon, Daemonic instability, Mark of Khorne, Terrifying(-1)",
    "Entourage: For each Greater Daemon of the same Chaos god, up to two units with this rule can be can be chosen that do not occupy an HQ slot.",
    "Herald: Up to two units with this rule can be taken as a single HQ choice.",
    "Locus of Khorne: The model and its attached unit get the \"Favoured enemy(everything)\" special rule."
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
  "locked_mark": "Khorne",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 73
};
