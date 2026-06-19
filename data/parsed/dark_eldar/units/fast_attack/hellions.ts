/**
 * HELLIONS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const hellions: Unit = {
  "name": "Hellions",
  "models": [
    {
      "name": "Hellion",
      "points": 29,
      "min": 5,
      "max": 20,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "1",
        "LD": "7",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Helliarch",
      "points": 39,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "1",
        "I": "5",
        "A": "2",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Hellglaive; Splinter pod.",
  "weapons": [
    {
      "name": "Hellglaive",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "Flurry(1), Quick(1)"
    },
    {
      "name": "Splinter pod",
      "range": "18\"",
      "type": "Assault 1",
      "s": "2",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive, Poison(3+)"
    }
  ],
  "option_groups": [
    {
      "header": "One model may be upgraded to a Helliarch for +10pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Helliarch",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Combat drugs, Hit & Run, Power through Pain"
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [
    "Cult"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Fast Attack",
  "default_size": 5,
  "min_cost": 145
};
