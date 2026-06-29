/**
 * SHADOWSEER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const shadowseer: Unit = {
  "name": "Shadowseer",
  "models": [
    {
      "name": "Shadowseer",
      "points": 66,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Shadowseer is equipped with: Plasma grenades.",
  "weapons": [
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Anti-grav, Command squad, Deflect, Parry, Squadron, Terrifying(-1)",
    "Holo-suit: The model gains a 4+ invulnerability save.",
    "Psyker: The model can cast 1 power and deny 1 power per battle round. It knows Smite and all powers from a chosen discipline."
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
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 66
};
