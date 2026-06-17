/**
 * TECH-PRIEST — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const techPriest: Unit = {
  "name": "Tech-Priest",
  "models": [
    {
      "name": "Tech-Priest",
      "points": 59,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tech-priest is equipped with: Omnissian axe; Servo arm.",
  "weapons": [
    {
      "name": "Omnissian axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Servo arm",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Extra attack"
    }
  ],
  "option_groups": [
    {
      "header": "Must be upgraded to one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Datasmith",
          "points": 5
        },
        {
          "name": "Enginseer",
          "points": 5
        },
        {
          "name": "Manipulus",
          "points": 5
        },
        {
          "name": "Myrmidax",
          "points": 5
        },
        {
          "name": "Technoarchaeologist",
          "points": 5
        },
        {
          "name": "Underseer",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "For each HQ selection, one Tech-Priest may be selected that does not occupy an Elite slot.",
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
    "Canticles of the Omnissiah, Choir Master, Command Squad",
    "Bionics: This model receives a 6+ invulnerability save.",
    "Datasmith\nCybertheurgy: This model may be attached to units of Robot Monstrous Infantry. If this model is attached to a unit of Robots, the bonus from their Battle Protocols is improved by +1.",
    "Enginseer:\nBlessing of the Omnissiah: At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a wound or armor penetration roll.",
    "Manipulus\nGalvanic Field: This model and its attached unit's Arc, Galvanic and Radium weapons increase their range by 6\". Additionally, their AP increases by -1.",
    "Myrmidax\nBringer of Blessed Ruin: This model gains the Favored Enemy ability.",
    "Technoarchaeologist\nSeekers of Divine Arcana: This model and its attached unit gain the \"Warded\" ability while within 6\" of an objective. They additionally gain \"Objective secured!\".",
    "Underseer\nMaster of Menials: As long as this model is attached to a unit of Servitors, it and the attached unit may receive an Advance order and pursue fleeing units, even if they are Unyielding. Any attached Tech-thralls gain +1 to all hit rolls."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 59
};
