import type { Unit } from '../../../../../src/types/data';

export const eldarOutcast: Unit = {
  "name": "Eldar Outcast",
  "models": [
    {
      "name": "Ranger",
      "points": 44,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "1",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Ranger is equipped with: Ranger long rifle; Shuriken pistol.",
  "weapons": [
    {
      "name": "Ranger long rifle",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Shuriken pistol",
      "range": "12\"",
      "type": "Assault 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Battle Focus (see Codex Eldar), Infiltrator, Move through cover, Use cover",
    "Unmatched reconnaissance: While an Eldar Outcast is alive, the unit gains the \"Infiltrator\" ability."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 44
};
