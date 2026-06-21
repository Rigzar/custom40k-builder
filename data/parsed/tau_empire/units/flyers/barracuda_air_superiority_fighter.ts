/**
 * BARRACUDA AIR SUPERIORITY FIGHTER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const barracudaAirSuperiorityFighter: Unit = {
  "name": "Barracuda Air Superiority Fighter",
  "models": [
    {
      "name": "Barracuda",
      "points": 354,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Barracuda is a single model and equipped with: 2 Long-barrled burst cannons; 2 Missile pods; Swiftstrike burst cannon.",
  "weapons": [
    {
      "name": "Long-barrelled burst cannon",
      "range": "36\"",
      "type": "Rapid Fire 3",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Missile pod",
      "range": "30\"",
      "type": "Assault 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-Air"
    },
    {
      "name": "Swiftstrike burst cannon",
      "range": "36\"",
      "type": "Rapid Fire 5",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Swiftstrike railgun",
      "range": "60\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Cyclic ion blaster - Standard",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Cyclic ion blaster - Overcharged",
      "range": "18\"",
      "type": "Rapid Fire 3",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Ion cannon - Standard",
      "range": "60\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Ion cannon - Overcharged",
      "range": "60\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace both Long-barreled burst cannons",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Cyclic ion blaster",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Long-barrelled burst cannon"]
    },
    {
      "header": "Can replace its Swiftstrike burst cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Ion cannon",
          "points": 93
        },
        {
          "name": "Swiftstrike railgun",
          "points": 96
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Swiftstrike burst cannon"]
    },
    {
      "header": "Can get up to 4 Seeker missiles from the Armory.",
      "constraint": {
        "type": "fixed_max",
        "max": 4
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Supporting Fire",
    "Dispersion field: The model gains a 5+ invulnerability save."
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
  "min_cost": 354
};
