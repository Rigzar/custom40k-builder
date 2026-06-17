/**
 * DOGMATA — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const dogmata: Unit = {
  "name": "Dogmata",
  "models": [
    {
      "name": "Dogmata",
      "points": 48,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "2",
        "I": "3",
        "A": "2",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Dogmata is equipped with: Frag grenades; Krak grenades; Mace of the righteous.",
  "weapons": [
    {
      "name": "Frag grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Krak grenade",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Mace of the righteous",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-1",
      "d": "2",
      "abilities": "-"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Acts of Faith, Command squad, Shield of Faith",
    "Advisor: For every HQ selection, one Dogmata may be selected without taking up an Elite slot.",
    "Faithful: Can recite 1 hymn per battle round. A hymn is successfully recited on a roll of 3+. Knows one Hymn of Battle.",
    "Unwavering Resolve: The Dogmata and an attached unit get a 5+ invulnerability saving throw as long as she is within 3\" of a mission objective. Does not work against weapons with a Strength of 8 or higher."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
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
  "min_cost": 48,
  "is_priest": true
};
