/**
 * INQUISITOR — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 * PSYKER RULE (from datasheet):
 *   "Psyker: A psyker can cast 1 psychic power and dispel 1 psychic power per round. A psyker knows Smite, as well as one psychic power from a chosen psychic discipline."
 *   → Cast/deny limit and discipline access must be derived from this text.
 *   → ENGINE TODO: enforce power limit and 'chosen discipline' mechanic.
 */

import type { Unit } from '../../../../../src/types/data';

export const inquisitor: Unit = {
  "name": "Inquisitor",
  "models": [
    {
      "name": "Inquisitor",
      "points": 31,
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
      "points": 41,
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
      "header": "One Inquisitor per army can be upgraded to an Inquisitor Lord for +10 points.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": 10,
      "variant_link": "Inquisitor Lord",
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Command squad",
    "Psyker: A psyker can cast 1 psychic power and dispel 1 psychic power per round. A psyker knows Smite, as well as one psychic power from a chosen psychic discipline.",
    "Inquisitorial requisiton: The Inquisitor got additional access to a single weapon or wargear item from any Imperial faction. Requirements like specific traits or \"Only for xy\" must still be met. Wargear that got the same description or ability like an item from their own armory can't be taken.",
    "Inquisitor Lord: The Inquisitor Lord may purchase one additional item from any Imperial faction."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": true,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 31
};
