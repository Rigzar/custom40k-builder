/**
 * LORD OF CHANGE — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 3 powers and deny 3 powers per battle round. It knows Smite and all powers from all general disciplines and the discipline of Change."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const lordOfChange: Unit = {
  "name": "Lord of Change",
  "models": [
    {
      "name": "Lord of Change",
      "points": 440,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "T": "8",
        "W": "7",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Lord of Change is equipped with: Staff of Tzeentch.",
  "weapons": [
    {
      "name": "Staff of Tzeentch",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Each time when a Character model is slain with this weapon a Chaos Spawn enters the battlefield at the exact spot under your command."
    }
  ],
  "option_groups": [
    {
      "header": "Only one Greater Daemon of each type per army.",
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
    "Deep strike, Fearless, Greater Daemon, Mark of Tzeentch, Terrifying(-2)",
    "Master of Magic: A Lord of Change can never peril. Additionally, he uses 3 dice and discards the lowest while manifesting and denying psychic powers.",
    "Psyker: The model can cast 3 powers and deny 3 powers per battle round. It knows Smite and all powers from all general disciplines and the discipline of Change."
  ],
  "unit_type": "Monstrous Creature, Jump Pack Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Tzeentch",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 440
};
