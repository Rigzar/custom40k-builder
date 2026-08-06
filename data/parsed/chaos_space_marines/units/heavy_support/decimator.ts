/**
 * DECIMATOR — Heavy Support
 *
 * SOURCE: Chaos Space Marines 1.02.ods / "Decimator" (added CSM 1.02, 2026-07-24).
 * Walker, 1, 182 pts. Base: 2 Siege claws with Heavy flamers. Marks +10 each. Vehicle equipment.
 */

import type { Unit } from '../../../../../src/types/data';

export const decimator: Unit = {
  "name": "Chaos Decimator",
  "models": [
    {
      "name": "Decimator",
      "points": 182,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "11",
        "I": "3",
        "A": "4",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Decimator is equipped with: 2 Siege claws with Heavy flamers.",
  "weapons": [
    {
      "name": "Siege claw",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "Armorbane, AT(2), Shred"
    },
    {
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Butcher cannon",
      "range": "36\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(2)"
    },
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
      "name": "Soulburner petard",
      "range": "24\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Rending(5+), Barrage"
    },
    {
      "name": "Storm laser",
      "range": "36\"",
      "type": "Rapid Fire 3",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "May receive a Mark of Chaos:",
      "constraint": {
        "type": "mark"
      },
      "choices": [
        { "name": "Khorne", "points": 10 },
        { "name": "Nurgle", "points": 10 },
        { "name": "Slaanesh", "points": 10 },
        { "name": "Tzeentch", "points": 10 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May replace one Siege claw with Heavy flamer:",
      "constraint": {
        "type": "one"
      },
      "choices": [
        { "name": "Conversion beamer", "points": 34 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Siege claw"
      ]
    },
    {
      "header": "May replace each Siege claw with Heavy flamer:",
      "constraint": {
        "type": "fixed_max",
        "max": 2
      },
      "choices": [
        { "name": "Soulburner petard", "points": 0 },
        { "name": "Storm laser", "points": 11 },
        { "name": "Butcher cannon", "points": 45 }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Siege claw"
      ]
    }
  ],
  "abilities": [
    "Furioso: If the model is equipped with two melee weapons, it gains +2 attacks.",
    "Smash and incinerate: Whenever this model inflicts at least one Penetrating Hit on an enemy Transport with a Siege claw, any units embarked inside suffer 4 automatic hits according to the profile of the Heavy flamer.",
    "Unholy Vigor: Roll a die the first time the model is eliminated. 1,2 - Remove the model. 3,4 - Set it back up with 1 Hull Point and repair 1 Engine Damage or Weapon Damage. 5,6 - Set it up again with 2 Hull Points and repair 1 Engine Damage and Weapon Damage."
  ],
  "unit_type": "Walker",
  "keywords": [
    "Chaos Space Marine",
    "Vehicle"
  ],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 2,
  "locked_mark": null,
  "advisor": false,
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 182
};
