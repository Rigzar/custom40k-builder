/**
 * STORMSURGE — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const stormsurge: Unit = {
  "name": "Stormsurge",
  "models": [
    {
      "name": "Stormsurge",
      "points": 730,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "4+",
        "BS": "4+",
        "S": "8",
        "T": "8",
        "W": "9",
        "I": "2",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Stormsurge is equipped with: Cluster rocket system; 4 Destroyer missiles; Pulse blastcannon; Twin flamer; Twin smart missile system.",
  "weapons": [
    {
      "name": "Cluster rocket system",
      "range": "48\"",
      "type": "Heavy 14",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Destroyer missile",
      "range": "60\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "Ammo(1), AT(2), Tank hunter"
    },
    {
      "name": "Pulse blastcannon - Focused",
      "range": "10\"",
      "type": "Heavy 2",
      "s": "D",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(4)"
    },
    {
      "name": "Pulse blastcannon - Normal",
      "range": "20\"",
      "type": "Heavy 2",
      "s": "10",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(3), Explosive"
    },
    {
      "name": "Pulse blastcannon - Dispersed",
      "range": "30\"",
      "type": "Heavy 2",
      "s": "9",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Pulse driver cannon",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Barrage, Tank hunter"
    },
    {
      "name": "Twin airbursting fragmentation projector",
      "range": "24\"",
      "type": "Assault 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Seeking"
    },
    {
      "name": "Twin burst cannon",
      "range": "18\"",
      "type": "Assault 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Armor piercing(5+), Suppression"
    },
    {
      "name": "Twin flamer",
      "range": "9\"",
      "type": "Assault 8",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Twin smart missile system",
      "range": "30\"",
      "type": "Heavy 8",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Anti-Air, Seeking"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Pulse blastcannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Pulse driver cannon",
          "points": 120
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Pulse blastcannon"
      ]
    },
    {
      "header": "Can replace the Twin flamer",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin burst cannon",
          "points": 25
        },
        {
          "name": "Twin airbursting fragmentation projector",
          "points": 30
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Twin flamer"
      ]
    },
    {
      "header": "May be equipped with a Shield generator",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Shield generator",
          "points": 85
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Fearless, Supporting Fire",
    "Shield generator: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Gargantuan Creature",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
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
  "min_cost": 730
};
