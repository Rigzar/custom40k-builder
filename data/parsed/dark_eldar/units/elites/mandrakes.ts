/**
 * MANDRAKES — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const mandrakes: Unit = {
  "name": "Mandrakes",
  "models": [
    {
      "name": "Mandrake",
      "points": 27,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "6+"
      }
    },
    {
      "name": "Nightmare",
      "points": 32,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Baleblast; Glimmersteel blade.",
  "weapons": [
    {
      "name": "Baleblast",
      "range": "18\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Glimmersteel blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "infiltrator, Move through cover, Power through Pain",
    "Hunter: The unit rerolls hit and wound rolls against HQ and character models.",
    "Fade away: During each Reinforcement phase, the unit may be set up again following the rules for Infiltrator.",
    "Shadow Creature: The unit has a 5+ invulnerability saving throw. Hit rolls against the unit suffer a –1 penalty.",
    "Swords for hire: Add the <Kabal>, <Coven> or <Cult> KEYWORDS to the unit."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "-"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 140
};
