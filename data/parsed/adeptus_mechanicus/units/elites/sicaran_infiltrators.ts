/**
 * SICARAN INFILTRATORS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sicaranInfiltrators: Unit = {
  "name": "Sicaran Infiltrators",
  "models": [
    {
      "name": "Infiltrator",
      "points": 37,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    },
    {
      "name": "Infiltrator Princeps",
      "points": 37,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Enhanced Bionics; Flechette blaster; Taser goad.",
  "weapons": [
    {
      "name": "Flechette blaster",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Shred"
    },
    {
      "name": "Power sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Stubcarbine",
      "range": "18\"",
      "type": "Pistol 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Taser goad",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "1",
      "abilities": "Tesla"
    }
  ],
  "option_groups": [
    {
      "header": "Any model may swap their Flechette blaster and Taser goad",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Power sword and Stubcarbine",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit may select one Doctrina Imperative.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Canticles of the Omnissiah, Deflect, Infiltrator, Massive(1), Move through cover, Parry",
    "Enhanced Bionics: The model receives a 5+ invulnerability save."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 185
};
