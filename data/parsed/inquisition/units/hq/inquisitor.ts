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
      "points": 46,
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
    },
    {
      "name": "Heavy ordinance",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Colossal blast, Suppression, Tank hunter"
    },
    {
      "name": "Lance strike",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "D",
      "ap": "-6",
      "d": "5",
      "abilities": "AT(7), Explosive, Shield breaker(-3)"
    },
    {
      "name": "Melta torpedo",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(5), Armorbane, Barrage, Suppression"
    },
    {
      "name": "Barrage bomb",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Melta artillery",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "Armorbane, AT(4), Explosive"
    },
    {
      "name": "Precision lance strike",
      "range": "Unlimited",
      "type": "Assault 1",
      "s": "D",
      "ap": "-6",
      "d": "5",
      "abilities": "AT(6), Shield breaker(-3)"
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
    },
    {
      "header": "Massive Orbital Strike: select up to one weapon per HQ selection",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Heavy ordinance",
          "points": 161
        },
        {
          "name": "Melta torpedo",
          "points": 184
        },
        {
          "name": "Lance strike",
          "points": 247
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Sanctioned Bombardement: select up to one weapon per HQ selection",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Barrage bomb",
          "points": 42
        },
        {
          "name": "Melta artillery",
          "points": 88
        },
        {
          "name": "Precision lance strike",
          "points": 90
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Command squad",
    "Priest: This model can recite 1 hymn per turn. A hymn is successfully recited on a roll of 3+. It knows one hymn from the Hymns of Battle.",
    "Psyker: A psyker can cast 1 psychic power and dispel 1 psychic power per round. A psyker knows Smite, as well as one psychic power from a chosen psychic discipline.",
    "Inquisitorial requisiton: The Inquisitor got additional access to a single weapon or wargear item from any Imperial faction. Requirements like specific traits or \"Only for xy\" must still be met. Wargear that got the same description or ability like an item from their own armory can't be taken.",
    "Inquisitor Lord: The Inquisitor Lord may purchase one additional item from any Imperial faction.",
    "Plotting: Every HQ selection may \"shoot\" the selected Massive Orbital Strike in addition to their own weapons.",
    "Plotting: Every HQ selection may \"shoot\" the selected Sanctioned Bombardement in addition to their own weapons.",
    "(In)accuracy: Sanctioned Bombardments always hit on a roll of 5+. This roll can never be modified.",
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
  "min_cost": 31
};
