/**
 * TRIARCH STALKER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const triarchStalker: Unit = {
  "name": "Triarch Stalker",
  "models": [
    {
      "name": "Stalker",
      "points": 157,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
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
  "equipped_with": "A Stalker is a single model and equipped with: Particle shredder.",
  "weapons": [
    {
      "name": "Particle shredder",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Barrage"
    },
    {
      "name": "Reinforced forelimbs",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Twin heavy gauss cannon",
      "range": "36\"",
      "type": "Assault 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Heat ray - Dispersed",
      "range": "9\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-5",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Heat ray - Focused",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(3), Melta"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Particle shredder",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heat ray",
          "points": 36
        },
        {
          "name": "Twin heavy gauss cannon",
          "points": 83
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Reinforced forelimbs",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Move through cover, Squadron",
    "Living metal: The model repairs one vehicle damage at the start of each Reinforcement phase in any order.",
    "Quantum shielding: The model increases its armor values by +2 on each side, up to a maximum of 14. If it suffers a penetrating hit, it loses this bonus until the next Reinforcement phase.",
    "Targeting relay: After scoring a hit on an enemy unit, the next friendly unit firing on the same target can re-roll one failed to hit and wound roll.",
    "Reinforced forelimbs: The model gains WS 3+ and +2 A."
  ],
  "unit_type": "Walker",
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 157
};
