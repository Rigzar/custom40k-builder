/**
 * BRÔKHYR IRON-MASTER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const brKhyrIronMaster: Unit = {
  "name": "Brôkhyr Iron-master",
  "models": [
    {
      "name": "Brôkhyr Iron-master",
      "points": 67,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    },
    {
      "name": "E-COG",
      "points": 10,
      "min": 0,
      "max": 3,
      "stats": {
        "M": "6\"",
        "WS": "4+",
        "BS": "4+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Brôkhyr Forge-master",
      "points": 82,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "A Brôkhyr Iron-master is equipped with: Gravitic concussion grenades; Graviton hammer.",
  "weapons": [
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Graviton hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Graviton, Slow(-3)"
    }
  ],
  "option_groups": [
    {
      "header": "One Brôkhyr Iron-master per army can be upgraded to a Brôkhyr Forge-master for +15pts.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Steady Advance, Void armor",
    "Brôkhyr’s Guild: At the end of its move, the model may attempt to repair a vehicle within 6\". On a 4+, one \"Weapon destroyed\" or \"Engine damage\" result is removed from the vehicle, or 1 hull point is restored. Alternatively, a vehicle within 6\" can reroll a hit roll and a wound or armor penetration roll.",
    "Brôkhyr Forge-master: A Brôkhyr Forge-master may use Brôkhyr’s Guild twice.",
    "Companions: E-COGs do not prevent a Brôkhyr Iron-master from joining another unit and do not count towards passenger capacity in a transport.",
    "E-COG support: Add +1 to every Brôkhyr's Guild roll for each E-COG in the unit."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 67
};
