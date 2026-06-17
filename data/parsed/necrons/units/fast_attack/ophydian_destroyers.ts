/**
 * OPHYDIAN DESTROYERS — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const ophydianDestroyers: Unit = {
  "name": "Ophydian Destroyers",
  "models": [
    {
      "name": "Destroyer",
      "points": 52,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "1",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Hyperphase threshers.",
  "weapons": [
    {
      "name": "Hyperphase reap-blade",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(1), Flurry(2), Slow(-1)"
    },
    {
      "name": "Hyperphase threshers",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(2)"
    }
  ],
  "option_groups": [
    {
      "header": "For every 3 Destroyers, one Destroyer may swap their Hyperphase threshers",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hyperphase reap-blade",
          "points": 6
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Infiltrator, Massive(1), Parry, Reanimation Protocols",
    "Tunneling Horrors: Once per game, at the start of their activation, the unit may use a Stand & Shoot order to be immediately re-deployed anywhere on the battlefield. They must keep a minimum distance of 6\" to enemy models."
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
  "default_size": 3,
  "min_cost": 156
};
