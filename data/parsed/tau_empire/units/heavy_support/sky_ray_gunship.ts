/**
 * SKY RAY GUNSHIP — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const skyRayGunship: Unit = {
  "name": "Sky Ray Gunship",
  "models": [
    {
      "name": "Sky Ray",
      "points": 381,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "4+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "10",
        "I": "2",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Sky Ray is a single model and equipped with: Seeker missiles rack; 2 Markerlights; 2 Twin pulse carbines; Velocity tracker.",
  "weapons": [
    {
      "name": "Markerlight",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "Markerlight"
    },
    {
      "name": "Seeker missile rack",
      "range": "120\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-Air"
    },
    {
      "name": "Twin burst cannon",
      "range": "18\"",
      "type": "Rapid Fire 6",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin pulse carbine",
      "range": "24\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Twin smart missile system",
      "range": "30\"",
      "type": "Heavy 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace both Twin pulse carbines",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Two burst cannons",
          "points": 0
        },
        {
          "name": "two Smart missile systems",
          "points": 20
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin pulse carbine"]
    }
  ],
  "abilities": [
    "Anti-Grav, Supporting Fire"
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
  "min_cost": 381
};
