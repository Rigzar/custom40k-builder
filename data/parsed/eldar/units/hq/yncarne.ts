/**
 * YNCARNE — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const yncarne: Unit = {
  "name": "Yncarne",
  "models": [
    {
      "name": "Yncarne",
      "points": 222,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "6",
        "W": "5",
        "I": "7",
        "A": "5",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Yncarne is equipped with: The Sword of Souls.",
  "weapons": [
    {
      "name": "The Sword of Souls",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1), Poison(2+), Soul burn(2+)"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Yncarne per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    },
    {
      "header": "Can not be the mandatory HQ selection.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Deflect, Fearless, Greater Demon, Parry, Terrifying(-2), <Ynnari>",
    "Inevitable death: Once per game, after a friendly unit is removed, the Yncarne can be set up immediately to that position. Set the Yncarne up within 6\" of the last removed model. You have to keep at least 1\" away from enemy units. This way of moving does not count as an activation and can not be used while being in an ongoing melee combat.",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline."
  ],
  "unit_type": "Monstrous Creature",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 222
};
