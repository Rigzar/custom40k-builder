/**
 * SYDONIAN DRAGOONS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const sydonianDragoons: Unit = {
  "name": "Sydonian Dragoons",
  "models": [
    {
      "name": "Dragoon",
      "points": 107,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "6",
        "W": "4",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Bionics; Taser lance.",
  "weapons": [
    {
      "name": "Phosphor serpenta",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Luminagen"
    },
    {
      "name": "Radium jezzail",
      "range": "30\"",
      "type": "Heavy 2",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Decimate, Suppression"
    },
    {
      "name": "Taser lance - Charge",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Tesla, Quick(+1)"
    },
    {
      "name": "Taser lance - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(2), Deflagrate(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Taser lance",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Radium jezzail",
          "points": 32
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Taser lance - Charge", "Taser lance - Melee"]
    },
    {
      "header": "May be equipped with",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Phosphor serpenta",
          "points": 5
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
    "Canticles of the Omnissiah, Deflect, Squadron",
    "Bionics: The model receives a 6+ invulnerability save."
  ],
  "unit_type": "Bike, Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 1,
  "min_cost": 107
};
