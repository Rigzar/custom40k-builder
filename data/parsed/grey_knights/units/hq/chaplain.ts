/**
 * CHAPLAIN — HQ
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

export const chaplain: Unit = {
  "name": "Chaplain",
  "models": [
    {
      "name": "Chaplain",
      "points": 174,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Master of Sanctity",
      "points": 189,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "4",
        "LD": "9",
        "SV": "2+"
      }
    }
  ],
  "equipped_with": "A Chaplain is equipped with: Crozius Arcanum; Storm bolter; Frag grenade; Krak grenade.",
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
      "name": "Crozius Arcanum",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
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
      "header": "One Chaplain per army can be upgraded to a Master of Sanctity for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Master of Sanctity",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Aegis(5+), Brotherhood of Psykers, Deep Strike, Shrouding, They Shall Know No Fear, True Grit, Massive(1), Unyielding",
    "Faithful: The model can recite 1 prayer per turn. A prayer is successfully recited on a roll of 3+. If a prayer fails to be recited, it can not be attempted again by the same model in this battle round. The model knows all prayers from the Prayer list.",
    "Master of Sanctity: The model can recite 1 additional prayer per turn.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. He knows Smite and 1 power from a chosen discipline.",
    "Rosarius: The model gains a 4+ invulnverability save."
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
  "default_size": 1,
  "min_cost": 174,
  "is_priest": true
};
