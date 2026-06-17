/**
 * SHIELD-CAPTAIN — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const shieldCaptain: Unit = {
  "name": "Shield-Captain",
  "models": [
    {
      "name": "Shield-Captain",
      "points": 177,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "5",
        "T": "5",
        "W": "4",
        "I": "5",
        "A": "4",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Shield-Captain is equipped with: Bolt caster; Guardian spear.",
  "weapons": [
    {
      "name": "Relic balistus grenade launcher",
      "range": "18\"",
      "type": "Pistol 1",
      "s": "6",
      "ap": "-2",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Relic bolt caster",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "4",
      "ap": "-1",
      "d": "2",
      "abilities": "-"
    },
    {
      "name": "Relic castellan axe",
      "range": "-",
      "type": "Melee",
      "s": "+3",
      "ap": "-3",
      "d": "3",
      "abilities": "AT(2)"
    },
    {
      "name": "Relic guardian spear",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "2",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Relic sentinel blade",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "2",
      "abilities": "-"
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
      "header": "Can replace the Guardian spear",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Sentinel blade & Storm shield",
          "points": 5
        },
        {
          "name": "Castellan axe",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "A Shield-Captain with either a Guardian spear or a Castellan axe may get an Allarus terminator armor and Relic balistus grenade launcher for +33 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 33,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Has acces to weapons and gear from the Armory.",
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
    "Massive(1), Shield Host",
    "Battle Tactics: The Shield-Captain can assign two free Veteran abilities to himself and a friendly unit at the start of the deployment and replace both abilities during each Reinforcement phase. The friendly unit can be changed during each Reinforcement phase. All units must be able to gain the Veteran abilities. It does not count against the limit on how many Veteran abilities a unit can have.",
    "Custodian armor: The model gains a 5+ invulnerability save."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": true,
  "veteran_required": false,
  "veteran_max": 1,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 177
};
