import type { Unit } from '../../../../../src/types/data';

/**
 * SOURCE: Informacion/Leagues of Votann 1.02.ods, sheet "Hearthkyn Skyriggers" (new in 1.02).
 *
 * NOTE: the .ods option headers say "Hearthkyn Warriors" and "Autoch-pattern bolter" — copy-paste
 * from the Hearthkyn Warriors sheet, since a Skyrigger carries no bolter. The swap that is
 * actually available is against the model's Plasma axe, so the headers are reworded here and the
 * `replaces` targets the Plasma axe. Everything else is verbatim.
 *
 * UNIT TYPE: Jump Pack Infantry — per Core Rules L714-718 this intrinsically grants Deep Strike
 * (see specialRules.ts intrinsicAbilitiesForUnitType), so it is NOT restated in `abilities`.
 */
export const hearthkynSkyriggers: Unit = {
  "name": "Hearthkyn Skyriggers",
  "slot": "Elites",
  "models": [
    {
      "name": "Skyrigger",
      "points": 29,
      "min": 5,
      "max": 10,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "7",
        "SV": "3+"
      }
    }
  ],
  "variant_models": [
    {
      "name": "Theyn",
      "points": 34,
      "min": 0,
      "max": 0,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "1",
        "I": "3",
        "A": "1",
        "LD": "8",
        "SV": "3+"
      }
    }
  ],
  "equipped_with": "Every model is equipped with: Autoch-pattern bolt pistol; Gravitic concussion grenade; Plasma axe.",
  "weapons": [
    {
      "name": "Autoch-pattern bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Concussion weapon",
      "range": "-",
      "type": "Melee",
      "s": "x2",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2), Slow(-2)"
    },
    {
      "name": "Gravitic concussion grenades",
      "range": "6\"",
      "type": "Grenade 1",
      "s": "5",
      "ap": "-1",
      "d": "1",
      "abilities": "Explosive, Graviton"
    },
    {
      "name": "Plasma axe",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-2",
      "d": "1",
      "abilities": "-"
    },
    {
      "name": "Plasma sword",
      "range": "-",
      "type": "Melee",
      "s": "+1",
      "ap": "-3",
      "d": "1",
      "abilities": "-"
    }
  ],
  "option_groups": [
    {
      "header": "For every 10 models, two Skyriggers may swap their Plasma axe",
      "constraint": {
        "type": "per_n",
        "per_n": 10,
        "count_per_n": 2
      },
      "choices": [
        {
          "name": "Concussion weapon",
          "points": 10
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Plasma axe"]
    },
    {
      "header": "Up to 3 different Skyriggers may take one of the following",
      "constraint": {
        "type": "fixed_max",
        "max": 3
      },
      "choices": [
        {
          "name": "Medipack",
          "points": 5
        },
        {
          "name": "Multiwave comms array",
          "points": 5
        },
        {
          "name": "Pan spectral scanner",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false
    },
    {
      "header": "All remaining models in the unit may have their Plasma axe swapped",
      "constraint": {
        "type": "every"
      },
      "choices": [
        {
          "name": "Plasma sword",
          "points": 0
        }
      ],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": false,
      "replaces": ["Plasma axe"]
    },
    {
      "header": "One model may be upgraded to a Theyn for +5pts and gains access to weapons and gear from the Armory.",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Theyn",
          "points": 5
        }
      ],
      "inline_pts": null,
      "variant_link": "Theyn",
      "is_unique_per_army": false
    }
  ],
  "abilities": [
    "Eye of the Ancestors, Steady Advance, Void armor",
    "Medipack: The model gains the \"Narthecium\" ability.",
    "Multiwave comms array: The unit may use the Ld value of a friendly Kâhl, if any is present and alive in the army.",
    "Pan spectral scanner: All weapons of the unit gain +1 AP when shooting at targets that benefit from cover."
  ],
  "unit_type": "Jump Pack Infantry",
  "keywords": [],
  "is_character": false,
  "is_psyker": false,
  "is_vehicle": false,
  "is_monster": false,
  "has_armory_access": false,
  "champion_has_armory": true,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "locked_mark": null,
  "advisor": false,
  "default_size": 5,
  // 5 Skyriggers at 29 pts each — the minimum legal unit.
  "min_cost": 145
};
