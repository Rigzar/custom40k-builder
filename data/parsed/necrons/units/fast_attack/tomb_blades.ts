/**
 * TOMB BLADES — Fast Attack
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tombBlades: Unit = {
  "name": "Tomb Blades",
  "models": [
    {
      "name": "Tomb Blades",
      "points": 47,
      "min": 3,
      "max": 9,
      "stats": {
        "M": "12\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "2",
        "A": "1",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Twin tesla carbine.",
  "weapons": [
    {
      "name": "Particle beamer",
      "range": "24\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Twin gauss blaster",
      "range": "24\"",
      "type": "Rapid Fire 2",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Gauss"
    },
    {
      "name": "Twin tesla carbine",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Tesla, AT(-1)"
    }
  ],
  "option_groups": [
    {
      "header": "The unit can choose one of the following upgrades",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Nebuloscope",
          "points": 14
        },
        {
          "name": "Shadowloom & shieldvanes",
          "points": 22
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "The unit can swap its Twin tesla carbines",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Twin gauss blaster",
          "points": 7
        },
        {
          "name": "Particle beamer",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Twin tesla carbine"]
    }
  ],
  "abilities": [
    "Massive(2), Reanimation Protocols",
    "Nebuloscope: Ranged attacks gain \"Seeking\".",
    "Shadowloom and shieldvanes: The model gains a 3+ armor save and a  5+ invulnerability save."
  ],
  "unit_type": "Jet Bike, Necron",
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
  "min_cost": 141
};
