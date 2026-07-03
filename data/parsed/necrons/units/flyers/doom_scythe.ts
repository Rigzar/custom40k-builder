/**
 * DOOM SCYTHE — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const doomScythe: Unit = {
  "name": "Doom Scythe",
  "models": [
    {
      "name": "Doom Scythe",
      "points": 334,
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
  "equipped_with": "A Doom Scythe is a single model and equipped with: Heavy death ray; Twin tesla destructor.",
  "weapons": [
    {
      "name": "Heavy death ray",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(4)"
    },
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
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order."
  ],
  "unit_type": "Flyer",
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
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 334
};
