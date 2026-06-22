/**
 * STORMHAWK INTERCEPTOR — Flyers
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormhawkInterceptor: Unit = {
  "name": "Stormhawk Interceptor",
  "models": [
    {
      "name": "Stormhawk Interceptor",
      "points": 332,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "11",
        "I": "4",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Stormhawk Interceptor is a single model and equipped with: Icarus stormcannon; Twin assault cannon; Twin heavy bolter.",
  "weapons": [
    {
      "name": "Icarus stormcannon",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "Anti-Air, AT(1)"
    },
    {
      "name": "Las-talon",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3)"
    },
    {
      "name": "Skyhammer missile launcher",
      "range": "60\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Armorbane"
    },
    {
      "name": "Twin assault cannon",
      "range": "24\"",
      "type": "Heavy 8",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
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
      "name": "Typhoon missile launcher (Frag)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Typhoon missile launcher (Krak)",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Twin heavy bolter",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Typhoon missile launcher",
          "points": 45
        },
        {
          "name": "Skyhammer missile launcher",
          "points": 68
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin heavy bolter"]
    },
    {
      "header": "Can replace the Icarus stormcannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Las-talon",
          "points": 33
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Icarus stormcannon"]
    }
  ],
  "abilities": [],
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
  "min_cost": 332
};
