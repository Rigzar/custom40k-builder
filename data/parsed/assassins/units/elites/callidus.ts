/**
 * CALLIDUS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const callidus: Unit = {
  "name": "Callidus",
  "models": [
    {
      "name": "Callidus",
      "points": 142,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "4",
        "W": "4",
        "I": "6",
        "A": "4",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Callidus is equipped with: Neural shredder; Phase sword.",
  "weapons": [
    {
      "name": "Neural shredder",
      "range": "9\"",
      "type": "Pistol 4",
      "s": "*",
      "ap": "*",
      "d": "*",
      "abilities": "Flames"
    },
    {
      "name": "Phase sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "Shield breaker(-3)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep Strike, Deflect, Hit & Run, Infiltrator, Move through cover, Parry",
    "Lightning reflexes: The model gains a 4+ invulnerability save.",
    "Neural shredder: Roll 2D6 after a successful hit and compare it with the Leadership value of the unit. If your roll is higher, the target suffers one Mortal Wound for each point above their Ld value.",
    "Polymorphine: The model does not scatter when being set up via Deep Strike. Additionally, instead of using a \"Move & Shoot\" command, it always uses a \"Charge\" command and may still perform a 6\" Charge move after being set up via Deep Strike.",
    "Reign of Confusion: You may demand to re-roll either your or your enemy's first Initiative roll. Additionally you may decide whether your enemy rolls for Reinforcements during the first battle round.",
    "Cults Abominatioe: Any Chaos army may select either a single Assassin or one of each for a single Elite slot.",
    "Execution Force: Any Imperial army may select either a single Assassin or one of each for a single Elite slot."
  ],
  "unit_type": "Infantry",
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
  "default_size": 1,
  "min_cost": 142
};
