/**
 * EINHYR HEARTHGUARD — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const einhyrHearthguard: Unit = {
  "name": "Einhyr Hearthguard",
  "models": [
    {
      "name": "Hearthguard",
      "points": 48,
      "min": 4,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "1",
        "I": "3",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    },
    {
      "name": "Hesyr",
      "points": 53,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "5",
        "W": "1",
        "I": "3",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Exo armor; Gravitic concussion grenades; Plasma blade gauntlet; Volkanite disintegrator.",
  "weapons": [
    {
      "name": "Concussion gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2), Unwieldy"
    },
    {
      "name": "EtaCarn plasma gun",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    },
    {
      "name": "Plasma blade gauntlet",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Volkanite disintegrator",
      "range": "18\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Deadly(5+)"
    }
  ],
  "option_groups": [
    {
      "header": "Each model may swap their Plasma blade gauntlet",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Concussion gauntlet",
          "points": 14
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may swap their Volkanite disintegrator",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "EtaCarn plasma gun",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All models in the unit may take a crest",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Teleportation crest",
          "points": 0
        },
        {
          "name": "Weavefield crest",
          "points": 3
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Bodyguard, Eye of the Ancestors, Massive(1), Steady Advance, Unyielding, Void armor",
    "Exo-armor: The model gains a 5+ invulnerability save.",
    "Teleportation crest: The model gains the \"Deep Strike\" ability. Limit one crest per model.",
    "Weavefield crest: The model gains a 4+ invulnerability save. Limit one crest per model."
  ],
  "unit_type": "Infantry",
  "keywords": [],
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
  "min_cost": 245
};
