/**
 * DEATH JESTER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deathJester: Unit = {
  "name": "Death Jester",
  "models": [
    {
      "name": "Death Jester",
      "points": 64,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "8\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "5",
        "A": "3",
        "LD": "9",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Harlequin weapons; Plasma grenade; Shrieker cannon.",
  "weapons": [
    {
      "name": "Aeldari missile launcher - Sunburst",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Aeldari missile launcher - Starshot",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(2)"
    },
    {
      "name": "Bright lance",
      "range": "36\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-4",
      "d": "3",
      "abilities": "AT(3), Lance(+2)"
    },
    {
      "name": "Harlequin weapons",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-4",
      "d": "1",
      "abilities": "Precision(5+)"
    },
    {
      "name": "Plasma grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Shrieker cannon",
      "range": "30\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Bio-explosion, Poison(2+), Shuriken, Suppression"
    },
    {
      "name": "Shuriken cannon",
      "range": "24\"",
      "type": "Heavy 3",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Shuriken"
    }
  ],
  "option_groups": [
    {
      "header": "Every model can swap their Shrieker cannon",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Shuriken cannon",
          "points": 0
        },
        {
          "name": "Aeldari missile launcher",
          "points": 26
        },
        {
          "name": "Bright lance",
          "points": 45
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Anti-grav, Command squad, Deflect, Parry, Squadron, Terrifying(-1)",
    "Bio-explosion: If a model is killed by the Shrieker cannon, it explodes! The remaining unit suffers 4 automatic hits with Strength: 6, AP: -1, Damage: 1; Seeking.",
    "Holo-suit: The model gains a 4+ invulnerability save."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 64
};
