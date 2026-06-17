/**
 * SANCTIONED PSYKERS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The unit can cast 1 power and deny 1 power per battle round. It knows Smite and one power from a chosen discipline per Sanctioned Psyker model."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const sanctionedPsykers: Unit = {
  "name": "Sanctioned Psykers",
  "models": [
    {
      "name": "Sanctioned Psyker",
      "points": 9,
      "min": 4,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "5+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Sanctioned psi stave; Las pistol.",
  "weapons": [
    {
      "name": "Las pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Sanctioned psi stave",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "It's for your own good: Instead of suffering a Perils of the Warp attack, one model is immediately slain if a Commissar is within 6\".",
    "Psionic Choir: For every 3 models, the unit can manifest and banish +1 psychic power per round. As long as it consists of at least 3 models, it receives +1 on rolls to manifest psychic powers.",
    "Psyker: The unit can cast 1 power and deny 1 power per battle round. It knows Smite and one power from a chosen discipline per Sanctioned Psyker model."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 4,
  "min_cost": 36
};
