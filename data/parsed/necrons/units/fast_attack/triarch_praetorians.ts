/**
 * TRIARCH PRAETORIANS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const triarchPraetorians: Unit = {
  "name": "Triarch Praetorians",
  "models": [
    {
      "name": "Praetorian",
      "points": 59,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "10",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Particle caster; Voidblade.",
  "weapons": [
    {
      "name": "Particle caster",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Voidblade",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Shield breaker(-3)"
    },
    {
      "name": "Rod of covenant - Shooting",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-4",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Rod of covenant - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-1",
      "d": "1",
      "abilities": "Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "Any model can swap its Particle casters and Voidblades",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Rod of covenant",
          "points": 8
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Particle caster", "Voidblade"]
    }
  ],
  "abilities": [
    "Reanimation Protocols"
  ],
  "unit_type": "Jump Pack Infantry, Necron",
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
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 295
};
