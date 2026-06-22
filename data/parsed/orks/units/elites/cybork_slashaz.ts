/**
 * CYBORK SLASHAZ — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const cyborkSlashaz: Unit = {
  "name": "Cybork Slashaz",
  "models": [
    {
      "name": "Cybork Slasha",
      "points": 30,
      "min": 4,
      "max": 9,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    },
    {
      "name": "Cybork Painboy",
      "points": 40,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "5+",
        "S": "5",
        "T": "4",
        "W": "2",
        "I": "3",
        "A": "3",
        "LD": "6",
        "SV": "6+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Each Cybork Slasha is equipped with: Choppa, Slugga, Stikkbombz\nEach Cybork Painboy is equipped with: 'Urty Syringe, Slugga, Stikkbombz, Narthecium",
  "weapons": [
    {
      "name": "Big Choppa",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Choppa",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Kombi-burna - Shoota",
      "range": "18\"",
      "type": "Assault 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Combi"
    },
    {
      "name": "Kombi-burna - Burna",
      "range": "9\"",
      "type": "Assault 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Flames, Combi"
    },
    {
      "name": "Kombi-rokkit launcha - Shoota",
      "range": "18\"",
      "type": "Assault 3",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Combi"
    },
    {
      "name": "Kombi-rokkit launcha - Rokkit launcha",
      "range": "24\"",
      "type": "Assault 1",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Anti-air, Combi"
    },
    {
      "name": "Power Klaw",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Slugga",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Stikkbombz",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "3",
      "ap": "0",
      "d": "1",
      "abilities": "Explosive"
    },
    {
      "name": "Twin shoota",
      "range": "18\"",
      "type": "Assault 6",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "'Urty Syringe",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "Poison(4+)"
    }
  ],
  "option_groups": [
    {
      "header": "Any number of Cybork Slashas may swap their Choppa",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Big Choppa",
          "points": 1
        },
        {
          "name": "Power Klaw",
          "points": 13
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Choppa"]
    },
    {
      "header": "Any number of Cybork Slashas may swap their Slugga",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Twin shoota",
          "points": 8
        },
        {
          "name": "Kombi-rokkit launcha",
          "points": 9
        },
        {
          "name": "Kombi-burna",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Slugga"]
    },
    {
      "header": "The entire squad may receive one of the following upgrades per model",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Wildork",
          "points": 2
        },
        {
          "name": "'Eavy armor",
          "points": 11
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "per_model": true
    },
    {
      "header": "Can get one Kustom job.",
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
    "Dakka Dakka Dakka, Furious charge, Mob, Waaagh!",
    "Cybork Body: Each model has a 5+ invulnerability save.",
    "Dok's Speriments: After deployment and before the start of the first battle round, roll on the table below for each Cybork Slasha unit in the army:",
    "Narthecium: Once per turn, the damage of a wound against the unit can be reduced by 1. The ability must be declared after armor and invulnerability saves. Does not work against weapons with a strength of 8 or above."
  ],
  "unit_type": "Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Elites",
  "default_size": 5,
  "min_cost": 160
};
