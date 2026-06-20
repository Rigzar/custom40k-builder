/**
 * ANNIHILATION BARGE — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const annihilationBarge: Unit = {
  "name": "Annihilation Barge",
  "models": [
    {
      "name": "Annihilation Barge",
      "points": 208,
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
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Annihilation Barge is a single model and equipped with: Tesla cannon, Twin tesla destructor.",
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
    },
    {
      "name": "Twin tesla destructor",
      "range": "24\"",
      "type": "Heavy 8",
      "s": "7",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Tesla cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Gauss cannon",
          "points": 25
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 208
};
