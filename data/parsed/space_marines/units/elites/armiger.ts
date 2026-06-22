/**
 * ARMIGER — Elites
 * SOURCE: Informacion/Escalation.ods, sheet "Armiger" (Escalation cross-faction
 *   Lords of War supplement; not in the Space Marines ENG HTML).
 *
 * SLOT FIX (2026-06-22, user-reported): the .ods sheet for Armiger has NO trailing
 * "KEYWORDS / Lord of War" row (unlike Knight Castellan/Knight Paladin/Warhound, which
 * all do) — instead its own ABILITIES carry "Elite: Imperial armies may select units of
 * Armigers as an Elite choice.", the exact same override pattern as CSM's "War Dog"
 * (ki-escalation-wardog-engagement-gate-01). Was previously filed under the Lords of War
 * slot (with a guessed `keywords: ["Lord of War"]` — see escalation.md §7, "Armiger ...
 * given keywords: ['Lord of War'] for consistency", a guess that turned out wrong given
 * this override). Moved to Elites, `keywords: []`, and gated to Epic Battle via
 * `requires_engagement` since it's still an Escalation-supplement datasheet.
 */

import type { Unit } from '../../../../../src/types/data';

export const armiger: Unit = {
  "name": "Armiger",
  "models": [
    {
      "name": "Armiger",
      "points": 239,
      "min": 1,
      "max": 2,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "6",
        "FRONT": "12",
        "SIDE": "11",
        "REAR": "11",
        "I": "4",
        "A": "3",
        "HP": "3"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Armiger is equipped with: Armiger autocannon; Chain-cleaver; Heavy stubber.",
  "weapons": [
    {
      "name": "Armiger autocannon",
      "range": "48\"",
      "type": "Heavy 2",
      "s": "7",
      "ap": "-3",
      "d": "2",
      "abilities": "Anti-Air, AT(1)"
    },
    {
      "name": "Chain-cleaver",
      "range": "-",
      "type": "Melee",
      "s": "+4",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    },
    {
      "name": "Heavy stubber",
      "range": "36\"",
      "type": "Heavy 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Melta",
      "range": "12\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-5",
      "d": "1",
      "abilities": "AT(1), Melta"
    },
    {
      "name": "Thermal spear",
      "range": "24\"",
      "type": "Heavy 1",
      "s": "9",
      "ap": "-5",
      "d": "3",
      "abilities": "AT(3), Armorbane"
    }
  ],
  "option_groups": [
    {
      "header": "May swap the Armiger autocannon",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Thermal spear",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Armiger autocannon"
      ]
    },
    {
      "header": "May swap the Chain-cleaver",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Armiger autocannon",
          "points": 43
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Chain-cleaver"
      ]
    },
    {
      "header": "May swap the Heavy stubber",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Melta",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": [
        "Heavy stubber"
      ]
    }
  ],
  "abilities": [
    "Squadron",
    "Elite: Imperial armies may select units of Armigers as an Elite choice.",
    "Ion shield: The model gains a 5+ invulnerability save against ranged attacks. During the activation, you have to select wether the Ion shield covers attacks from the front, the left side, the right side or the back. The default side is always the front."
  ],
  "unit_type": "Walker",
  "keywords": [],
  "is_vehicle": true,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "requires_engagement": "epic",
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 239
};
