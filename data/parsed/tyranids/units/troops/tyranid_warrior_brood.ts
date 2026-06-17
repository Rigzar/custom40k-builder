/**
 * TYRANID WARRIOR BROOD — Troops
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const tyranidWarriorBrood: Unit = {
  "name": "Tyranid Warrior Brood",
  "models": [
    {
      "name": "Tyranid Warrior",
      "points": 36,
      "min": 3,
      "max": 6,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "5",
        "T": "5",
        "W": "2",
        "I": "4",
        "A": "2",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every model is equipped with: Scything talons; Spinefists.",
  "weapons": [
    {
      "name": "Barbed strangler",
      "range": "36\"",
      "type": "Assault 1",
      "s": "5",
      "ap": "0",
      "d": "1",
      "abilities": "Barrage, Suppression"
    },
    {
      "name": "Boneswords",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Deathspitter",
      "range": "24\"",
      "type": "Assault 2",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Devourer",
      "range": "18\"",
      "type": "Rapid Fire 2",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Lash whip and Bonesword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "Quick(+1)"
    },
    {
      "name": "Rending claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-2",
      "d": "1",
      "abilities": "Rending(5+)"
    },
    {
      "name": "Scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    },
    {
      "name": "Spinefists",
      "range": "12\"",
      "type": "Pistol 2",
      "s": "U",
      "ap": "0",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Venom cannon",
      "range": "36\"",
      "type": "Assault 1",
      "s": "6",
      "ap": "-2",
      "d": "1",
      "abilities": "Explosive"
    }
  ],
  "option_groups": [
    {
      "header": "For every three models, one Tyranid Warrior may swap their Spinefists",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Barbed strangler",
          "points": 19
        },
        {
          "name": "Venom cannon",
          "points": 19
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may swap their Scything talons",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Rending claws",
          "points": 0
        },
        {
          "name": "Boneswords",
          "points": 2
        },
        {
          "name": "Lash whip and Bonesword",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "Each model may swap their Spinefists",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Scything talons",
          "points": 0
        },
        {
          "name": "Devourer",
          "points": 2
        },
        {
          "name": "Deathspitter",
          "points": 2
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Leaping",
          "points": 6
        },
        {
          "name": "Winged",
          "points": 7
        },
        {
          "name": "Hardened Carapace",
          "points": 9
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "May additionally select any number of Basic and Advanced Biomorphs (see Armory).",
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
    "Fearless, Massive(1), Move Through Cover, Synapse",
    "Winged: If this Biomorph is taken, the unit counts as a Fast Attack selection."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Tyranid"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Troops",
  "default_size": 3,
  "min_cost": 108,
  "is_monster": false
};
