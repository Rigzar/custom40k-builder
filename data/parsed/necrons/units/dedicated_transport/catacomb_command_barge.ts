/**
 * CATACOMB COMMAND BARGE — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const catacombCommandBarge: Unit = {
  "name": "Catacomb Command Barge",
  "models": [
    {
      "name": "Catacomb Command Barge",
      "points": 205,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "2+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Catacomb Command Barge is a single model and equipped with: Tesla cannon.",
  "weapons": [
    {
      "name": "Gauss cannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "Gauss"
    },
    {
      "name": "Tesla cannon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla"
    }
  ],
  "option_groups": [
    {
      "header": "Can only be taken by an Overlord. The Overlord must start the game embarked on the Command Barge.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can replace the Tesla cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gauss cannon",
          "points": 32
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Tesla cannon"]
    }
  ],
  "abilities": [
    "Anti-Grav",
    "Chariot: The Overlord is transported by the Catacomb Command Barge (CCB) and can leave it at any time. No other model may be transported by the CCB. The Overlord can fight normally in melee while being embarked in the CCB.",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Quantum shielding: The model increases its armor values by +2 on each side, up to a maximum of 14. If it suffers a penetrating hit, it loses this bonus until the next Reinforcement phase."
  ],
  "unit_type": "Vehicle",
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 205
};
