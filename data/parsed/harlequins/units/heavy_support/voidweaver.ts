/**
 * VOIDWEAVER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const voidweaver: Unit = {
  "name": "Voidweaver",
  "models": [
    {
      "name": "Voidweaver",
      "points": 238,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "5",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Voidweaver is equipped with: Haywire cannon; 2 Shuriken cannons.",
  "weapons": [
    {
      "name": "Haywire cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Haywire"
    },
    {
      "name": "Prismatic cannon - Dispersed",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "3",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Prismatic cannon - Focused",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "Explosive"
    },
    {
      "name": "Prismatic cannon - Lance",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(1), Beam, Lance(+1)"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace its Haywire cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Prismatic cannon",
          "points": 29
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Haywire cannon"]
    }
  ],
  "abilities": [
    "Anti-Grav, Fast, Open, Squadron",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Mirage launcher: Instead of shooting a weapon, the unit may gain the benefit of cover."
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
  "min_cost": 238
};
