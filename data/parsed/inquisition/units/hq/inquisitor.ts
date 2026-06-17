/**
 * INQUISITOR — HQ
 *
 * SOURCE: Inquisition.ods (updated 2026-06-17)
 *
 * ARMY SPECIAL RULE:
 *   "Authority of the Inquisition: Every model in the army with access to the Armory
 *    may select a single item from any Imperial faction."
 *   → Army-wide rule; replaces the old per-model "Inquisitorial requisition" ability.
 *
 * PSYKER / PRIEST (optional upgrades):
 *   Both are optional +5 pt upgrades. Engine: is_psyker + is_priest both true (unit
 *   can be either; player picks one upgrade). This is a known approximation — the
 *   engine does not currently enforce "pick exactly one of psyker/priest".
 */

import type { Unit } from '../../../../../src/types/data';

export const inquisitor: Unit = {
  "name": "Inquisitor",
  "models": [
    {
      "name": "Inquisitor",
      "points": 36,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "4",
        "A": "2",
        "LD": "8",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Inquisitor Lord",
      "points": 51,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "3",
        "T": "3",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "9",
        "SV": "4+"
      }
    }
  ],
  "equipped_with": "An Inquisitor is equipped with: Frag grenades; Krak grenades.",
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
    }
  ],
  "option_groups": [
    {
      "header": "An Inquisitor cannot be the mandatory choice for the HQ slot.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be upgraded to a psyker for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be upgraded to a priest for +5 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 5,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "One Inquisitor per army can be upgraded to an Inquisitor Lord for +15 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": "Inquisitor Lord",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Authority of the Inquisition: Every model in the army with access to the Armory may select a single item from any Imperial faction.",
    "Command squad",
    "Priest: This model can recite 1 hymn per turn. A hymn is successfully recited on a roll of 3+. It knows one hymn from the Hymns of Battle.",
    "Psyker: This model can cast 1 psychic power and dispel 1 psychic power per round. It knows Smite, as well as one psychic power from a chosen psychic discipline.",
    "Quarry: After units are deployed, you may secretly choose an enemy unit to be your quarry. At the start of any battle round, if your quarry is on the battlefield, you may reveal your choice. Friendly Inquisition units get +1 to hit your revealed quarry.",
    "Inquisitor Lord: This model may choose a second quarry."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "is_priest": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 36
};
