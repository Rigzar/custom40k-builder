/**
 * FELLBLADE — Lords of War
 * SOURCE: Informacion/Escalation.ods, sheet "Fellblade" (Escalation cross-faction
 *   Lords of War supplement; not in the Space Marines ENG HTML).
 */

import type { Unit } from '../../../../../src/types/data';

export const fellblade: Unit = {
  "name": "Fellblade",
  "models": [
    {
      "name": "Fellblade",
      "points": 1042,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "6+",
        "BS": "3+",
        "S": "8",
        "FRONT": "14",
        "SIDE": "13",
        "REAR": "12",
        "I": "4",
        "A": "1",
        "HP": "5"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Fellblade is equipped with: 2 Laser destroyers; Twin Fellblade accelerator cannon; Twin heavy flamer.",
  "weapons": [
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
      "name": "Heavy flamer",
      "range": "9\"",
      "type": "Assault 4",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Laser destroyer",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "4",
      "abilities": "AT(4), Lance(1), Tank hunter"
    },
    {
      "name": "Multi-melta",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Melta"
    },
    {
      "name": "Quad lascannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin Fellblade accelerator cannon - AP shell",
      "range": "100\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Armorbane"
    },
    {
      "name": "Twin Fellblade accelerator cannon - HP shell",
      "range": "100\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Twin heavy bolter",
      "range": "36\"",
      "type": "Rapid Fire 4",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin heavy flamer",
      "range": "9\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Flames"
    }
  ],
  "option_groups": [
    {
      "header": "May swap their Twin heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin heavy bolter",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Twin heavy flamer"
      ]
    },
    {
      "header": "May swap their 2 Laser destroyers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Quad lascannons",
          "points": 272
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Laser destroyer"
      ]
    },
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 11
        },
        {
          "name": "Heavy flamer",
          "points": 13
        },
        {
          "name": "Heavy bolter",
          "points": 18
        },
        {
          "name": "Multi-melta",
          "points": 35
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [],
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
  "min_cost": 1042
};
