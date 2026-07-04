/**
 * NEPHILIM JETFIGHTER — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const nephilimJetfighter: Unit = {
  "name": "Nephilim Jetfighter",
  "models": [
    {
      "name": "Nephelim Jetfighter",
      "points": 237,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "5",
        "FRONT": "11",
        "SIDE": "11",
        "REAR": "11",
        "I": "4",
        "A": "1",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Nephilim Jetfighter is a single model and equipped with: Avenger mega bolter, 6 Blacksword missiles, Twin heavy bolter.",
  "weapons": [
    {
      "name": "Avenger mega bolter",
      "range": "48\"",
      "type": "Heavy 5",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Anti-Air"
    },
    {
      "name": "Blacksword missile",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "Ammo(1), Anti-Air, AT(1)"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
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
      "header": "Can replace the Avenger mega bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin lascannon",
          "points": 75
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Avenger mega bolter"]
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
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Flyers",
  "default_size": 1,
  "min_cost": 237
};
