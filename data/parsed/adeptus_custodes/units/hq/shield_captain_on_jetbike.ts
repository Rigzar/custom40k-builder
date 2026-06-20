/**
 * SHIELD-CAPTAIN ON JETBIKE — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const shieldCaptainOnJetbike: Unit = {
  "name": "Shield-Captain on Jetbike",
  "models": [
    {
      "name": "Shield-Captain",
      "points": 272,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "12\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "6",
        "W": "5",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Shield-Captain on Jetbike is equipped with: Relic Interceptor lance; Lastrum bolt cannon.",
  "weapons": [
    {
      "name": "Adrathic devastator",
      "range": "18\"",
      "type": "Heavy 2",
      "s": "6",
      "ap": "-3",
      "d": "3",
      "abilities": "-"
    },
    {
      "name": "Hurricane bolter",
      "range": "24\"",
      "type": "Rapid Fire 6",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lastrum bolt cannon",
      "range": "36\"",
      "type": "Rapid Fire 2",
      "s": "6",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Salvo launcher",
      "range": "24\"",
      "type": "Heavy 2",
      "s": "8",
      "ap": "-5",
      "d": "2",
      "abilities": "AT(2), Armorbane"
    },
    {
      "name": "Twin las-pulser",
      "range": "24\"",
      "type": "Heavy 4",
      "s": "8",
      "ap": "-2",
      "d": "2",
      "abilities": "AT(1)"
    },
    {
      "name": "Relic interceptor lance - Charge",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2), Quick(+1), Can only be used with a Charge order"
    },
    {
      "name": "Relic interceptor lance - Melee",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "Unwieldy"
    }
  ],
  "option_groups": [
    {
      "header": "Only one Shield-Captain per army.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May swap the Lastrum bolt cannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Hurricane bolter",
          "points": 13
        },
        {
          "name": "Adrathic devastator",
          "points": 38
        },
        {
          "name": "Salvo launcher",
          "points": 65
        },
        {
          "name": "Twin las-pulser",
          "points": 116
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Lastrum bolt cannon"]
    }
  ],
  "abilities": [
    "Shield Host",
    "Battle Tactics: The Shield-Captain can assign two free Veteran abilities to himself and a friendly unit at the start of the deployment and replace both abilities during each Reinforcement phase. The friendly unit can be changed during each Reinforcement phase. All units must be able to gain the Veteran abilities. It does not count against the limit on how many Veteran abilities a unit can have.",
    "Custodian armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Character Model, Jetbike",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 272
};
