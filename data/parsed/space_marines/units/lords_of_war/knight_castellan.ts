/**
 * KNIGHT CASTELLAN — Lords of War
 * SOURCE: Informacion/Escalation.ods, sheet "Knight Castellan" (Escalation
 *   cross-faction Lords of War supplement; not in the Space Marines ENG HTML).
 * "wether" preserved verbatim from the canonical Ion shield ability text
 *   (FAQ #5 / golden rule — same typo as the CSM Knight Desecrator).
 */

import type { Unit } from '../../../../../src/types/data';

export const knightCastellan: Unit = {
  "name": "Knight Castellan",
  "models": [
    {
      "name": "Knight Castellan",
      "points": 622,
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
  "equipped_with": "A Knight Castellan is equipped with: Conflagration cannon; 4 Shield breaker missiles; Thundercoil harpoon; 2 Twin melta; Twin siegebreaker cannon.",
  "weapons": [
    {
      "name": "Conflagration cannon",
      "range": "18\"",
      "type": "Heavy 12",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "Flames"
    },
    {
      "name": "Plasma decimator - Standard",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Barrage"
    },
    {
      "name": "Plasma decimator - Overheating",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Barrage, Overheating"
    },
    {
      "name": "Shield breaker missile",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-4",
      "d": "3",
      "abilities": "Ammo(1), AT(4), Shield breaker(-3)"
    },
    {
      "name": "Thundercoil harpoon",
      "range": "18\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-6",
      "d": "5",
      "abilities": "AT(5), Haywire"
    },
    {
      "name": "Twin melta",
      "range": "12\"",
      "type": "Assault 2",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Twin siegebreaker cannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Explosive, Suppression"
    },
    {
      "name": "Volcano lance",
      "range": "80\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-5",
      "d": "4",
      "abilities": "AT(4), Beam"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Thundercoil harpoon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Plasma decimator",
          "points": 241
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Thundercoil harpoon"
      ]
    },
    {
      "header": "May swap the Conflagration cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Volcano lance",
          "points": 67
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Conflagration cannon"
      ]
    },
    {
      "header": "May swap four Shield breaker missiles and the Twin siegebreaker cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "2 Shield breaker missiles and 2 Twin siegebreaker cannons",
          "points": 29
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Shield breaker missile",
        "Twin siegebreaker cannon"
      ]
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
  "min_cost": 622
};
