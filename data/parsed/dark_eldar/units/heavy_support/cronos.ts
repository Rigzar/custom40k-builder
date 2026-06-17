/**
 * CRONOS — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const cronos: Unit = {
  "name": "Cronos",
  "models": [
    {
      "name": "Cronos",
      "points": 146,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "5",
        "I": "4",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Cronos is equipped with: Spirit syphon.",
  "weapons": [
    {
      "name": "Spirit-leech tentacles",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(2)"
    },
    {
      "name": "Spirit syphon",
      "range": "9\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive, Seeking"
    },
    {
      "name": "Spirit vortex",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "May be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Spirit-leech tentacles",
          "points": 7
        },
        {
          "name": "Spirit vortex",
          "points": 16
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-Grav, Power through Pain, Squadron",
    "Soul harvest: After each activation in which the Cronos eliminates an enemy model, a friendly Dark Eldar unit within 18\" gains a Power Through Pain token."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Coven"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 146
};
