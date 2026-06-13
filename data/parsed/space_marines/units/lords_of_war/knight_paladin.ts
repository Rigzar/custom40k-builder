/**
 * KNIGHT PALADIN — Lords of War
 * SOURCE: Informacion/Escalation.ods, sheet "Knight Paladin" (Escalation
 *   cross-faction Lords of War supplement; not in the Space Marines ENG HTML).
 * "wether" and "canon" preserved verbatim from the canonical text
 *   (FAQ #5 / golden rule — same typo as the CSM Knight Desecrator).
 */

import type { Unit } from '../../../../../src/types/data';

export const knightPaladin: Unit = {
  "name": "Knight Paladin",
  "models": [
    {
      "name": "Knight Paladin",
      "points": 737,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "FRONT": "13",
        "SIDE": "12",
        "REAR": "12",
        "I": "4",
        "A": "3",
        "HP": "4"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Knight Paladin is equipped with: Heavy stubber; Knight melee weapon; Rapid-fire battle canon.",
  "weapons": [
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Ironstorm missile pod",
      "range": "72\"",
      "type": "Heavy 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Indirect, Suppression"
    },
    {
      "name": "Knight melee weapon - Strike",
      "range": "-",
      "type": "Melee",
      "s": "D",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Knight melee weapon - Sweep",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Flurry(3)"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Rapid-fire battle cannon",
      "range": "72\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Barrage, Tank hunter"
    },
    {
      "name": "Stormspear rocket pod",
      "range": "48\"",
      "type": "Heavy 3",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    },
    {
      "name": "Twin icarus autocannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "Anti-Air, AT(1)"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Heavy stubber",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Melta",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Heavy stubber"
      ]
    },
    {
      "header": "Can be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin icarus autocannon",
          "points": 53
        },
        {
          "name": "Ironstorm missile pod",
          "points": 77
        },
        {
          "name": "Stormspear rocket pod",
          "points": 122
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Ion shield: The model gains a 4+ invulnerability save against ranged attacks. During the activation, you have to select wether the Ion shield covers attacks from the front, the left side, the right side or the back. The default side is always the front."
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
  "min_cost": 737
};
