/**
 * DEATHMARKS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deathmarks: Unit = {
  "name": "Deathmarks",
  "models": [
    {
      "name": "Deathmark",
      "points": 65,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "2+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "1",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Synaptic disintegrator.",
  "weapons": [
    {
      "name": "Synaptic disintegrator",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "-2",
      "d": "2",
      "abilities": "Armor piercing(5+), Suppression"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep strike, Reanimation Protocols",
    "Aetheric Interception: Deathmarks roll two dice less for scatter when deep striking. Additionally, once an enemy unit emerges from reserve, a Deathmark unit that has not yet used its order this round of combat may perform an intercept. The Deathmark unit is removed from the field or from reserves and immediately deployed within 18\" of the enemy reserve unit. The Deathmarks can then fire at that unit as if it had been given the \"Move & Shoot\" order. The attack resolves after the enemy unit has been deployed and before it takes another action."
  ],
  "unit_type": "Infantry, Necron",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 325
};
