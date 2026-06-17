import type { Unit } from '../../../../../src/types/data';

export const servitors: Unit = {
  "name": "Servitors",
  "models": [
    {
      "name": "Servitor",
      "points": 22,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "5+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Paired shock chargers.",
  "weapons": [
    {
      "name": "Paired shock chargers",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Shock charger",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Plasma cannon - Standard",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma cannon - Supercharge",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Explosive, Overheating"
    }
  ],
  "option_groups": [
    {
      "header": "Any Servitor may swap their Paired shock chargers for a Shock charger and one of the following:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy bolter",
          "points": 13
        },
        {
          "name": "Multi-melta",
          "points": 27
        },
        {
          "name": "Plasma cannon",
          "points": 50
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Unyielding",
    "Bionics: The model gains a 6+ invulnerability save.",
    "Mind-lock: As long as a character is attached to this unit, the Servitors get +1 to hit rolls."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
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
  "min_cost": 22
};
