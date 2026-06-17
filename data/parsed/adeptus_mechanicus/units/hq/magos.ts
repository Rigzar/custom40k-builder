/**
 * MAGOS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const magos: Unit = {
  "name": "Magos",
  "models": [
    {
      "name": "Magos",
      "points": 100,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "2",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Archmagos",
      "points": 115,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Magos is equipped with: -.",
  "weapons": [
    {
      "name": "Conversion beamer - Short range",
      "range": "0\" - 24\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Conversion beamer - Mid range",
      "range": "24\" - 48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Conversion beamer - Long range",
      "range": "48\" - 72\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Eradication ray - Short range",
      "range": "1\" - 12\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Eradication ray - Mid range",
      "range": "12\" - 24\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-3",
      "d": "2",
      "abilities": "Explosive"
    },
    {
      "name": "Grav serpenta",
      "range": "18\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-3",
      "d": "1",
      "abilities": "Explosive, Grav"
    },
    {
      "name": "Magnarail lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Beam"
    },
    {
      "name": "Meltagun",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Photon thruster",
      "range": "24\"",
      "type": "Assault 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1), Beam, Blind, Lance(2), Overheating"
    },
    {
      "name": "Rad cleanser",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames, Decimate"
    },
    {
      "name": "Rotor cannon",
      "range": "30\"",
      "type": "Assault 4",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Servo-arc claw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Extra attack, Haywire"
    },
    {
      "name": "Transonic cannon",
      "range": "12\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+), Flames, Suppression"
    },
    {
      "name": "Plasma fusil - Standard",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1)"
    },
    {
      "name": "Plasma fusil - Overheating",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Overheating"
    },
    {
      "name": "Volkite blaster",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Soul burn(6+)"
    }
  ],
  "option_groups": [
    {
      "header": "One Magos per army can be upgraded to an Archmagos for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Archmagos",
      "is_unique_per_army": true
    },
    {
      "header": "May be equipped with up to two different weapons",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        {
          "name": "Transonic cannon",
          "points": 8
        },
        {
          "name": "Rad cleanser",
          "points": 13
        },
        {
          "name": "Servo-arc claw",
          "points": 13
        },
        {
          "name": "Rotor cannon",
          "points": 17
        },
        {
          "name": "Meltagun",
          "points": 21
        },
        {
          "name": "Volkite blaster",
          "points": 25
        },
        {
          "name": "Grav serpenta",
          "points": 28
        },
        {
          "name": "Magnarail lance",
          "points": 29
        },
        {
          "name": "Photon thruster",
          "points": 53
        },
        {
          "name": "Plasma fusil",
          "points": 55
        },
        {
          "name": "Eradication ray",
          "points": 64
        },
        {
          "name": "Conversion beamer",
          "points": 71
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May be upgraded to one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Datasmith",
          "points": 5
        },
        {
          "name": "Engineseer",
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
    }
  ],
  "abilities": [
    "Canticles of the Omnissiah, Choir Master, Unyielding",
    "Archmagos: The range of this model's Canticles of the Omnissiah is extended by 3\".",
    "Blessing of the Omnissiah: At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a wound or armor penetration roll.",
    "Mechandrite Harness: This model may use up to three ranged weapons per activation, regardless of their type.",
    "Enhanced Bionics: This model receives a 5+ invulnerability save.",
    "Datasmith\nCybertheurgy: This model may be attached to units of Robot Monstrous Infantry. If this model is attached to a unit of Robots, the bonus from their Battle Protocols is improved by +1.",
    "Enginseer:\nImproved Blessing of the Omnissiah: This model may use Blessing of the Omnissiah one additional time per activation and the roll is successfull on a 3+.",
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
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 100
};
