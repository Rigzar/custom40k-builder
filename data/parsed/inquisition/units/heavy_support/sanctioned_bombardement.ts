import type { Unit } from '../../../../../src/types/data';

export const sanctionedBombardement: Unit = {
  "name": "Sanctioned Bombardement",
  "models": [
    {
      "name": "Sanctioned Bombardement",
      "points": 0,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "5+",
        "S": "-",
        "T": "-",
        "W": "-",
        "I": "-",
        "A": "-",
        "LD": "-",
        "SV": "-"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Select up to one weapon per HQ selection.",
  "weapons": [
    {
      "name": "Barrage bomb",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Melta artillery",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(4), Explosive"
    },
    {
      "name": "Precision lance strike",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "D",
      "ap": "-6",
      "d": "5",
      "abilities": "AT(6), Shield breaker(-3)"
    }
  ],
  "option_groups": [
    {
      "header": "Select up to one weapon per HQ selection:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Barrage bomb",
          "points": 42
        },
        {
          "name": "Melta artillery",
          "points": 88
        },
        {
          "name": "Precision lance strike",
          "points": 90
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Plotting: Every HQ selection may \"shoot\" the selected Sanctioned Bombardement in addition to their own weapons.",
    "(In)accuracy: Sanctioned Bombardments always hit on a roll of 5+. This roll can never be modified."
  ],
  "unit_type": "Strategic Asset",
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 0
};
