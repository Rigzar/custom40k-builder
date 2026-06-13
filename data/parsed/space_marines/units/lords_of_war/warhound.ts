/**
 * WARHOUND — Lords of War
 * SOURCE: Informacion/Escalation.ods, sheet "Warhound" (Escalation cross-faction
 *   Lords of War supplement; not in the Space Marines ENG HTML).
 * min_cost = 524 base + cheapest mandatory pick (Inferno gun, +84) ×2, since
 *   "equipped with: -" and both "Must pick two weapons" groups are required.
 */

import type { Unit } from '../../../../../src/types/data';

export const warhound: Unit = {
  "name": "Warhound",
  "models": [
    {
      "name": "Warhound",
      "points": 524,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "-",
        "BS": "3+",
        "S": "10",
        "FRONT": "14",
        "SIDE": "13",
        "REAR": "12",
        "I": "1",
        "A": "1",
        "HP": "8"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Warhound is equipped with: -.",
  "weapons": [
    {
      "name": "Apocalypse missile launcher",
      "range": "240\"",
      "type": "Heavy 5",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Colossal blast, Indirect"
    },
    {
      "name": "Inferno gun",
      "range": "18\"",
      "type": "Assault 12",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Flames"
    },
    {
      "name": "Plasma blastgun - Rapid",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Plasma blastgun - Overload",
      "range": "96\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Colossal blast"
    },
    {
      "name": "Twin turbo-laser destructor",
      "range": "96\"",
      "type": "Heavy 2",
      "s": "D",
      "ap": "-4",
      "d": "4",
      "abilities": "AT(4), Barrage"
    },
    {
      "name": "Vulcan mega-bolter",
      "range": "60\"",
      "type": "Heavy 15",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Must pick two weapons (1st)",
      "constraint": {
        "type": "one",
        "required": true
      },
      "choices": [
        {
          "name": "Inferno gun",
          "points": 84
        },
        {
          "name": "Vulcan mega-bolter",
          "points": 270
        },
        {
          "name": "Plasma blastgun",
          "points": 549
        },
        {
          "name": "Apocalypse missile launcher",
          "points": 649
        },
        {
          "name": "Twin turbo-laser destructor",
          "points": 1024
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Must pick two weapons (2nd)",
      "constraint": {
        "type": "one",
        "required": true
      },
      "choices": [
        {
          "name": "Inferno gun",
          "points": 84
        },
        {
          "name": "Vulcan mega-bolter",
          "points": 270
        },
        {
          "name": "Plasma blastgun",
          "points": 549
        },
        {
          "name": "Apocalypse missile launcher",
          "points": 649
        },
        {
          "name": "Twin turbo-laser destructor",
          "points": 1024
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Void Shields (2): The model has two Void shields. Each hit scored against it will instead hit a Void shield (while at least one remains active). Close combat attacks come from inside the shield and therefore are not stopped. Void shields have an Armour value of 12. A Glancing hit or Penetrating hit (or any hit from a Destroyer weapon) scored against a Void shield causes it to collapse. After all Void shields have collapsed, further hits strike the model instead. In the Rally Phase, roll 1D6 for each collapsed Void shield. Each roll of 5+ instantly restores one collapsed shield."
  ],
  "unit_type": "Super-heavy Vehicle",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": true,
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
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 692
};
