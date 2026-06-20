/**
 * PTERAXII STERYLIZORS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const pteraxiiSterylizors: Unit = {
  "name": "Pteraxii Sterylizors",
  "models": [
    {
      "name": "Sterylizor",
      "points": 44,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "4+"
      }
    },
    {
      "name": "Sterylizor Alpha",
      "points": 49,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Arc grenades; Phosphor torch.",
  "weapons": [
    {
      "name": "Arc grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Haywire"
    },
    {
      "name": "Phosphor torch",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Luminagen"
    },
    {
      "name": "Pteraxii talons",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    }
  ],
  "option_groups": [
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
    "Canticles of the Omnissiah",
    "Bionics: This model receives a 6+ invulnerability save.",
    "Sky Dive: Once per game, at the start of their activation, the unit may use a Stand & Shoot order to be immediately re-deployed anywhere on the battlefield. They must keep a minimum distance of 6\" to enemy models."
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 225
};
