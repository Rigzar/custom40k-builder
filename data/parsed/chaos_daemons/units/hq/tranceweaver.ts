/**
 * TRANCEWEAVER — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from the discipline of Excess."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const tranceweaver: Unit = {
  "name": "Tranceweaver",
  "models": [
    {
      "name": "Tranceweaver",
      "points": 45,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "8\"",
        "WS": "3+",
        "BS": "4+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "6",
        "A": "4",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Tranceweaver is equipped with: Ravaging claws.",
  "weapons": [
    {
      "name": "Ravaging claws",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "Armour piercing(5+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deepstrike, Daemon, Daemonic instability, Mark of Slaanesh, Terrifying(-1)",
    "Entourage: For each Greater Daemon of the same Chaos god, up to two units with this rule can be can be chosen that do not occupy an HQ slot.",
    "Herald: Up to two units with this rule can be taken as a single HQ choice.",
    "Locus of Slaanesh: The model and its attached unit can move an additional D6\" with a charge order.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and one power from the discipline of Excess."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "armory_gear_only": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": "Slaanesh",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 45
};
