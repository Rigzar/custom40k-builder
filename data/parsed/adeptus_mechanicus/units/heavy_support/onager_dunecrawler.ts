/**
 * ONAGER DUNECRAWLER — Heavy Support
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const onagerDunecrawler: Unit = {
  "name": "Onager Dunecrawler",
  "models": [
    {
      "name": "Onager Dunecrawler",
      "points": 236,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "-",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "12",
        "REAR": "11",
        "I": "3",
        "A": "1",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Twin heavy phosphor blaster.",
  "weapons": [
    {
      "name": "Cognis heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Cognis"
    },
    {
      "name": "Eradication beamer - Short range",
      "range": "1\" - 9\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3)"
    },
    {
      "name": "Eradication beamer - Mid range",
      "range": "9\" - 18\"",
      "type": "Heavy 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Explosive"
    },
    {
      "name": "Eradication beamer - Long range",
      "range": "18\" - 36\"",
      "type": "Heavy 1",
      "s": "6",
      "ap": "-1",
      "d": "1",
      "abilities": "Barrage"
    },
    {
      "name": "Icarus array - Daedalus missile launcher",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "7",
      "ap": "-4",
      "d": "2",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Icarus array - Gatling rocket launcher",
      "range": "48\"",
      "type": "Heavy 5",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Anti-air"
    },
    {
      "name": "Icarus array - Twin icarus autocannon",
      "range": "48\"",
      "type": "Heavy 4",
      "s": "7",
      "ap": "-2",
      "d": "1",
      "abilities": "AT(1), Anti-air"
    },
    {
      "name": "Neutron laser",
      "range": "48\"",
      "type": "Heavy 1",
      "s": "10",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(4), Explosive"
    },
    {
      "name": "Twin heavy phosphor blaster",
      "range": "36\"",
      "type": "Heavy 6",
      "s": "5",
      "ap": "-2",
      "d": "1",
      "abilities": "Luminagen"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Twin heavy phosphor blaster",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Eradication beamer",
          "points": 26
        },
        {
          "name": "Icarus array",
          "points": 95
        },
        {
          "name": "Cognis heavy stubber & Neutron laser",
          "points": 172
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Can be equipped with an additional Cognis heavy stubber for +15 points.",
      "constraint": {
        "type": "one"
      },
      "choices": [],
      "inline_pts": 15,
      "variant_link": null,
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Move through cover, Squadron",
    "Emanatus force field: The model gains a 5+ invulnerability save.",
    "Icarus array: The model may fire with all three weapons at the same target each activation."
  ],
  "unit_type": "Vehicle",
  "keywords": [],
  "is_vehicle": true,
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
  "slot": "Heavy Support",
  "default_size": 1,
  "min_cost": 236
};
