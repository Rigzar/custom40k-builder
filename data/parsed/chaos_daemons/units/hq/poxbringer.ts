/**
 * POXBRINGER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from the discipline of Decay."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const poxbringer: Unit = {
  "name": "Poxbringer",
  "models": [
    {
      "name": "Poxbringer",
      "points": 60,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "4",
        "I": "3",
        "A": "3",
        "LD": "7",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Poxbringer is equipped with: Bilesword.",
  "weapons": [
    {
      "name": "Bilesword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "Poison(4+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Command squad, Deepstrike, Daemon, Daemonic instability, Mark of Nurgle, Terrifying(-1)",
    "Entourage: For each Greater Daemon of the same Chaos god, up to two units with this rule can be can be chosen that do not occupy an HQ slot.",
    "Herald: Up to two units with this rule can be taken as a single HQ choice.",
    "Locus of Nurgle: The model and its attached unit can still fight in close combat, even if they have already been slain before their initiative step.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from the discipline of Decay."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Nurgle",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 60
};
