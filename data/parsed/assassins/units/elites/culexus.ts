/**
 * CULEXUS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const culexus: Unit = {
  "name": "Culexus",
  "models": [
    {
      "name": "Culexus",
      "points": 181,
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
  "equipped_with": "A Culexus is equipped with: Animus Speculum, Life drain.",
  "weapons": [
    {
      "name": "Animus Speculum",
      "range": "18\"",
      "type": "Assault 3",
      "s": "5",
      "ap": "-4",
      "d": "2",
      "abilities": "Psi-shock, Seeking"
    },
    {
      "name": "Life drain",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-5",
      "d": "2",
      "abilities": "Poison(2+)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep Strike, Hit & Run, Infiltrator, Move through cover",
    "Animus Speculum: If a psyker is within 18\" range, the type changes to \"Assault 6\"",
    "Etherium: The Culexus can never be hit on anything better but a natural roll of 6.",
    "Lightning reflexes: The model gains a 4+ invulnerability save.",
    "Psionic Abomination: The unit can never be targeted by psychic powers. Enemy psykers within 18\" suffer a -1 penalty on any roll to manifest and dispel psychic powers. Enemy units within 12\" suffer a -1 penalty to their Leadership. All ranged and melee attacks made by the unit against a target within 6\" gain \"Shield breaker(-1)\".",
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
  "min_cost": 181
};
