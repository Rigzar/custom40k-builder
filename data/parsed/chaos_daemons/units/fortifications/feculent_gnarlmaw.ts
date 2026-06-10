/**
 * FECULENT GNARLMAW — Fortifications
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const feculentGnarlmaw: Unit = {
  "name": "Feculent Gnarlmaw",
  "models": [
    {
      "name": "Feculent Gnarlmaw",
      "points": 90,
      "min": 1,
      "max": 3,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "-",
        "S": "6",
        "T": "7",
        "W": "5",
        "I": "-",
        "A": "-",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Feculent Gnarlmaw is a single model and equipped with: Sickness Blossoms.",
  "weapons": [
    {
      "name": "Sickness Blossoms",
      "range": "6\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames, Poison(4+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Daemon, Daemonic instability, Mark of Nurgle",
    "Gnarlmaw infestation: Set up each Gnarlmaw individually during the deployment process, after every other unit has been placed. They do not have to be within 2\" of each other. They can't be placed closer than 6\" to enemy units, but can be placed anywhere on the table.",
    "Shroud of Flies: Friendly models with the \"Mark of Nurgle\" ability within 6\" count as benefitting from obscuring terrain.",
    "The Plague Bells Chime: The model may heal a friendly unit (excluding itself) within 7\" for D3 wounds during its activation. Dead models may be revived with this ability. Injured models have to be fully healed first. Only works on models that have the \"Daemon\" and \"Mark of Nurgle\" abilities. Character models and vehicles are always excluded.",
    "Unmanned: A Feculent Gnarlmaw can't contest or capture mission objectives."
  ],
  "unit_type": "",
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
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "Fortifications",
  "default_size": 1,
  "min_cost": 90
};
