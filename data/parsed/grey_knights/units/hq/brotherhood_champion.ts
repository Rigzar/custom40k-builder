/**
 * BROTHERHOOD CHAMPION — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const brotherhoodChampion: Unit = {
  "name": "Brotherhood Champion",
  "models": [],
  "variant_models": [
    {
      "name": "Brotherhood Champion",
      "points": 104,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "A Brotherhood Champion is equipped with: Nemesis force weapon; Storm bolter; Frag grenade; Krak grenade.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Nemesis daemon hammer",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(3), Force weapon, Shield breaker(-1), Slow(-3)"
    },
    {
      "name": "Nemesis force weapon",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Nemesis warding stave",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "AT(1), Force weapon, Shield breaker(-1)"
    },
    {
      "name": "Storm bolter",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "Can replace the Nemesis force weapon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Nemesis warding stave",
          "points": 11
        },
        {
          "name": "Nemesis daemon hammer",
          "points": 23
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Nemesis force weapon"]
    },
    {
      "header": "Only one per army.",
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
    "Aegis(5+), Brotherhood of Psykers, Shrouding, They Shall Know No Fear, True Grit",
    "Honor or Death: At the start of the activation, if an enemy HQ or Character is within 12\", the placed Order is converted to Charge. The Brotherhood Champion and an attached unit must use the Order to engage in close combat with the enemy HQ or character model.",
    "Martial Superiority: The model may re-roll 1 to hit and 1 to wound roll per activation.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 0,
  "min_cost": 0
};
