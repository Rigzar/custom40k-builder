/**
 * PATRIARCH — HQ
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

export const patriarch: Unit = {
  "name": "Patriarch",
  "models": [
    {
      "name": "Patriarch",
      "points": 128,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "5",
        "W": "4",
        "I": "7",
        "A": "5",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Patriach is equipped with: -.",
  "weapons": [
    {
      "name": "Patriarch claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "2",
      "abilities": "Armor piercing(5+), Deadly(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Patriarch per army.",
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
    "Ambush, Deflect, Infiltrator, Massive(1), Parry, Terrifying(-1), Use cover",
    "Living Idol: Friendly units within 12\" range may use the Patriarch's Leadership value.",
    "Preternatural senses: The model gains a 5+ invulnerability save.",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from a chosen discipline.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
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
  "min_cost": 128
};
