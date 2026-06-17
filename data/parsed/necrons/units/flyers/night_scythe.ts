/**
 * NIGHT SCYTHE — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const nightScythe: Unit = {
  "name": "Night Scythe",
  "models": [
    {
      "name": "Night Scythe",
      "points": 225,
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
        "I": "2",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Night Scythe is a single model and equipped with: Twin tesla destructor.",
  "weapons": [
    {
      "name": "Twin tesla destructor",
      "range": "36\"",
      "type": "Assault 8",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Transport: This model has a transport capacity of 12 models. If the model is destroyed, passengers do not suffer damage, but are placed in reserve. They will automatically appear via Deep strike the next time they activate. Passengers may disembark even if the model is not in hover mode."
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 225
};
