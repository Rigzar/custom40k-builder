/**
 * EINHYR CHAMPION — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const einhyrChampion: Unit = {
  "name": "Einhyr Champion",
  "models": [
    {
      "name": "Einhyr Champion",
      "points": 70,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "4",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Einhyr Champion is equipped with: Exo-armor; Gravitic concussion grenades.",
  "weapons": [
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "For every unit of Einhyr Hearthguard taken in an Elite slot, a single Einhyr Champion may be included in the army that does not take up an Elite slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command Squad, Eye of the Ancestors, Massive(1), Steady Advance, Unyielding, Void armor",
    "Exemplar of the Einhyr: This model and its attached unit gain Frenzy(2).",
    "Exo-armor: This model gains a 5+ invulnerability save.",
    "Honor or Death: At the start of this model's activation, if an enemy HQ or Character is within 12\", its placed Order is converted to Charge. The Einhyr Champion and its attached unit must use the Order to engage in close combat with the enemy HQ or character model."
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
  "min_cost": 70
};
