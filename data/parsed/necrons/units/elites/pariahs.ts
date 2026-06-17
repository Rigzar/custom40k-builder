/**
 * PARIAHS — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const pariahs: Unit = {
  "name": "Pariahs",
  "models": [
    {
      "name": "Pariah",
      "points": 52,
      "min": 4,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Void scythe with inbuilt Gauss caster.",
  "weapons": [
    {
      "name": "Gauss caster",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Void scythe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Shield breaker(-3), Unwieldy"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Psionic Abomination: The unit can never be targeted by psychic powers. Enemy psykers within 18\" suffer a -1 penalty on any roll to manifest and dispel psychic powers. Enemy units within 12\" suffer a -1 penalty to their Leadership. All ranged and melee attacks made by the unit against a target within 6\" gain \"Shield breaker(-1)\"."
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
  "default_size": 4,
  "min_cost": 208
};
