/**
 * HEXMARK DESTROYER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hexmarkDestroyer: Unit = {
  "name": "Hexmark Destroyer",
  "models": [
    {
      "name": "Hexmark Destroyer",
      "points": 92,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "3",
        "I": "2",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Hexmark Destroyer is equipped with: Enmitic disintegrator pistol.",
  "weapons": [
    {
      "name": "Enmitic disintegrator pistol",
      "range": "18\"",
      "type": "Pistol 6",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "Deflagrate(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Deep strike, Regeneration(1)",
    "Royal Assassin: For each Lord or Skorpekh Lord, a Hexmark Destructor can be chosen that does not occupy an elite slot."
  ],
  "unit_type": "Character Model, Infantry, Necron",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "default_size": 1,
  "min_cost": 92
};
