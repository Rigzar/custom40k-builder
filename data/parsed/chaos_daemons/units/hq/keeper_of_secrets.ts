/**
 * KEEPER OF SECRETS — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from the discipline of Excess."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const keeperOfSecrets: Unit = {
  "name": "Keeper of Secrets",
  "models": [
    {
      "name": "Keeper of Secrets",
      "points": 349,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "3+",
        "S": "7",
        "T": "7",
        "W": "7",
        "I": "7",
        "A": "4",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Keeper of Secrets is equipped with: Living whip; Snapping claws; Witstealer sword.",
  "weapons": [
    {
      "name": "Living whip",
      "range": "6\"",
      "type": "Pistol 4",
      "s": "6",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Snapping claws",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Slow(-3), Flurry(2), Only 2 attacks per activation can be done with this profile."
    },
    {
      "name": "Witstealer sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1)"
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
    "Deep strike, Deflect, Fearless, Greater Daemon, Mark of Slaanesh, Parry, Terrifying(-2)",
    "Psyker: The model can cast 2 powers and deny 2 powers per battle round. It knows Smite and all powers from the discipline of Excess."
  ],
  "unit_type": "Monstrous Creature",
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
  "locked_mark": "Slaanesh",
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 349
};
