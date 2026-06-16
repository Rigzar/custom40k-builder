/**
 * FIRE RAPTOR — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const fireRaptor: Unit = {
  "name": "Fire Raptor",
  "models": [
    {
      "name": "Fire Raptor",
      "points": 617,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
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
  "equipped_with": "A Fire Raptor is a single model and equipped with: 2 Twin autocannons; Twin avenger bolt cannon; 2 Twin hellstrike launchers.",
  "weapons": [
    {
      "name": "Quad heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 8",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin autocannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin avenger bolt cannon",
      "range": "36\"",
      "type": "Heavy 10",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin hellstrike launcher",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the 2 Twin hellstrike launchers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Twin lascannons",
          "points": 60
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace the 2 Twin autocannons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Quad heavy bolters",
          "points": 37
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Hover mode"
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
  "min_cost": 617
};
