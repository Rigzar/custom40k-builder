import type { Unit } from '../../../../../src/types/data';

export const daemonhosts: Unit = {
  "name": "Daemonhosts",
  "models": [
    {
      "name": "Daemonhost",
      "points": 22,
      "min": 1,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Runic chains.",
  "weapons": [
    {
      "name": "Runic chains",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Soul Burn(6+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Daemon",
    "Psyker: This model can cast 1 psychic power and dispel 1 psychic power per round. It knows Smite, as well as one psychic power from the Malefic discipline."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
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
