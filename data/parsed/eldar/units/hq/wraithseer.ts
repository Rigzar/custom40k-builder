/**
 * WRAITHSEER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from the Wraithseer discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const wraithseer: Unit = {
  "name": "Wraithseer",
  "models": [
    {
      "name": "Wraithseer",
      "points": 231,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "7",
        "T": "8",
        "W": "6",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Wraithseer is equipped with: Ghostspear.",
  "weapons": [
    {
      "name": "Bright lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "D-cannon",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Deadly(5+), Explosive, Graviton"
    },
    {
      "name": "Ghostspear",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2), Force Weapon"
    },
    {
      "name": "Scatter laser",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    },
    {
      "name": "Starcannon",
      "range": "36\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Wraithcannon",
      "range": "18\"",
      "type": "Assault 1",
      "s": "D",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(3), Graviton"
    },
    {
      "name": "Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Wraithseer per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "May be equipped with one of the following",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Scatter laser",
          "points": 19
        },
        {
          "name": "Shuriken cannon",
          "points": 20
        },
        {
          "name": "Wraithcannon",
          "points": 38
        },
        {
          "name": "Aeldari missile launcher",
          "points": 41
        },
        {
          "name": "Starcannon",
          "points": 49
        },
        {
          "name": "Bright lance",
          "points": 56
        },
        {
          "name": "D-cannon",
          "points": 108
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "<Wraith>",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from the Wraithseer discipline.",
    "Wraithbone: Reduces AP of enemy attacks by -1 (to a minimum of 0).",
    "Wraithshield: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [
    "Wraith"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 231
};
