/**
 * VINDICARE — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const vindicare: Unit = {
  "name": "Vindicare",
  "models": [
    {
      "name": "Vindicare",
      "points": 189,
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
  "equipped_with": "A Vindicare is equipped with: Exitus pistol; Exitus rifle.",
  "weapons": [
    {
      "name": "Exitus pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-4",
      "d": "3",
      "abilities": "Poison(2+)"
    },
    {
      "name": "Exitus rifle - Hellfire",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-4",
      "d": "3",
      "abilities": "Poison(2+), Sunder(2), Suppression"
    },
    {
      "name": "Exitus rifle - Turbo penetrator",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-5",
      "d": "4",
      "abilities": "Armorbane, AT(3)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep Strike, Deflect, Hit & Run, Infiltrator, Move through cover, Parry",
    "Headshot: If an enemy model suffers a wound from the Exitus rifle or pistol but is not eliminated, roll 1D6. On a 3+ the model suffers one Mortal Wound.",
    "Lightning reflexes: The model gains a 4+ invulnerability save.",
    "Perfect aim: The model ignores any negative to hit modifications. The player may chose which model in the target unit has to be removed as a casualty.",
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
  "min_cost": 189
};
