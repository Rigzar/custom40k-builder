/**
 * CHAPLAIN DREADNOUGHT — HQ
 *
 * SOURCE (canonical — Space Marines ENG/Chaplain Dreadnought.html)
 * ────────────────────────────────────────────────────────────────
 * PROFILE: 1 Chaplain Dreadnought — M:6" WS:2+ BS:2+ S:6 FRONT:12 SIDE:12 REAR:10 I:5 A:3 HP:3 — 251 pts
 * EQUIPPED WITH: Dreadnought close combat weapon; Heavy flamer.
 * WEAPONS:
 *   Assault cannon          24" Heavy 4   S:6  AP:-2 D:1  Armor piercing(5+)
 *   Dreadnought cccw         -  Melee     S:x2 AP:-3 D:2  AT(2)
 *   Heavy flamer            9"  Assault 4 S:5  AP:-1 D:1  Flames
 *   Inferno cannon          12" Heavy 6   S:6  AP:-2 D:1  Flames
 *   Multi-melta             24" Assault 1 S:8  AP:-5 D:2  AT(2), Melta
 *   Plasma cannon (Standard)  36" Heavy 1 S:7  AP:-3 D:1  AT(1), Explosive
 *   Plasma cannon (Overcharged) 36" Heavy 1 S:8 AP:-4 D:2 AT(2), Explosive, Overheating
 *   Storm bolter            24" Rapid Fire 2 S:4 AP:-1 D:1  -
 *   Twin lascannon          48" Heavy 2   S:9  AP:-4 D:3  AT(3)
 * OPTIONS:
 *   Must pick one weapon: Inferno cannon +20, DCCW+Heavy flamer +29, DCCW+Storm bolter +33,
 *     Assault cannon +40, Multi-melta +46, Plasma cannon +123, Twin lascannon +173
 *   May swap the Heavy flamer: Storm bolter +5
 *   Only one Master of Sanctity or Chaplain Dreadnought per army.
 *   Has access to vehicle equipment from the Armory.
 *   Can gain one Veteran ability.
 * ABILITIES:
 *   Faithful: recite 2 prayers/round on 3+; knows all prayers of a selected list.
 *     (NOTE: Chaplain Dreadnought recites 2/round vs Chaplain's 1/round — correct.)
 *   Furioso: two melee weapons → +2A.
 *   Reliquary: 5+ inv save.
 *   (No TSKNF — Vehicle unit type, not creature.)
 * UNIT TYPE: Vehicle, Walker
 *
 * ENGINE STATUS: ✓ all data matches HTML. is_priest:true correct. is_vehicle:true → vehicle armory.
 */

import type { Unit } from '../../../../../src/types/data';

export const chaplainDreadnought: Unit = {
  "name": "Chaplain Dreadnought",
  "models": [
    {
      "name": "Chaplain Dreadnought",
      "points": 251,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "10",
        "I": "5",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Chaplain Dreadnought is equipped with: Dreadnought close combat weapon; Heavy flamer.",
  "weapons": [
    {
      "name": "Assault cannon",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Dreadnought close combat weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
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
      "name": "Inferno cannon",
      "range": "12\"",
      "type": "Heavy 6",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
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
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Twin lascannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Plasma cannon (Standard)",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-3",
      "d": "1",
      "abilities": "AT(1), Explosive"
    },
    {
      "name": "Plasma cannon (Overcharged)",
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
      "header": "Must pick one weapon from this list",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Inferno cannon",
          "points": 20
        },
        {
          "name": "Dreadnought close combat weapon and Heavy flamer",
          "points": 29
        },
        {
          "name": "Dreadnought close combat weapon and Storm bolter",
          "points": 33
        },
        {
          "name": "Assault cannon",
          "points": 40
        },
        {
          "name": "Multi-melta",
          "points": 46
        },
        {
          "name": "Plasma cannon",
          "points": 123
        },
        {
          "name": "Twin lascannon",
          "points": 173
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Heavy flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Storm bolter",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Heavy flamer"]
    },
    {
      "header": "Only one Master of Sanctity or Chaplain Dreadnought per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Faithful: Can recite 2 prayers per round. A prayer is successfully recited on a roll of 3+. Knows all prayers of a selected list.",
    "Furioso: If the model has two melee weapons, it gains +2 attacks.",
    "Reliquary: The model receives a 5+ invulnerability save."
  ],
  "unit_type": "Vehicle, Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 251,
  "is_priest": true
};
