/**
 * TELEMON HEAVY DREADNOUGHT — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const telemonHeavyDreadnought: Unit = {
  "name": "Telemon Heavy Dreadnought",
  "models": [
    {
      "name": "Telemon Heavy Dreadnought",
      "points": 367,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "13",
        "REAR": "11",
        "I": "4",
        "A": "4",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Telemon Heavy Dreadnought is a single model and equipped with: 2 Telemon caestus with Twin plasma projector; Spiculus bolt launcher.",
  "weapons": [
    {
      "name": "Iliastus accelerator culverin",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Spiculus bolt launcher",
      "range": "24\"",
      "type": "Rapid Fire 5",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin plasma projector",
      "range": "12\"",
      "type": "Assault 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Telemon caestus",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Flurry(1)"
    },
    {
      "name": "Arachnus storm cannon - Beam",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(2), Beam"
    },
    {
      "name": "Arachnus storm cannon - Burst",
      "range": "24\"",
      "type": "Heavy 6",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "Can swap each Telemon caestus with Twin plasma projector",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Arachnus storm cannon",
          "points": 90
        },
        {
          "name": "Iliastus accelerator culverin",
          "points": 60
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Telemon caestus", "Twin plasma projector"]
    }
  ],
  "abilities": [
    "Shield Host",
    "Reinforced Atomantic Shielding: The model has a 4+ invulnerability save. Enemy attacks receive a -3 AT penalty (to a minimum of -3)."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 367
};
