/**
 * GALATUS CONTEMPTOR DREADNOUGHT — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const galatusContemptorDreadnought: Unit = {
  "name": "Galatus Contemptor Dreadnought",
  "models": [
    {
      "name": "Contemptor Dreadnought",
      "points": 237,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Contemptor Dreadnought is a single model and equipped with: Galatus shield; Galatus warblade.",
  "weapons": [
    {
      "name": "Infernus incinerator",
      "range": "12\"",
      "type": "Assault 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Lastrum storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin adrathic destructor",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "5",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Galatus warblade - Melee",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Flurry(1)"
    },
    {
      "name": "Galatus warblade - Ranged",
      "range": "12\"",
      "type": "Pistol 8",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Achillus dreadspear - Melee",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Quick(1)"
    },
    {
      "name": "Achillus dreadspear - Ranged",
      "range": "24\"",
      "type": "Pistol 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Can swap its Galatus shield and Galatus warblade",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Achillus dreadspear & 2 Infernus incinerators",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can swap each Infernus incinerator",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Lastrum storm bolter",
          "points": 19
        },
        {
          "name": "Twin adrathic destructor",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Shield Host",
    "Custodes Atomantic Shielding: The model has a 5+ invulnerability save. Enemy attacks receive a -1 AT penalty (to a minimum of 1).",
    "Galatus shield: The model gains the abilities \"Deflect\" and \"Parry\"."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 237
};
