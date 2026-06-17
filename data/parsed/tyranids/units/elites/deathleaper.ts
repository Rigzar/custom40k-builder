/**
 * DEATHLEAPER — Elites
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const deathleaper: Unit = {
  "name": "Deathleaper",
  "models": [
    {
      "name": "Deathleaper",
      "points": 180,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "6",
        "T": "5",
        "W": "5",
        "I": "7",
        "A": "5",
        "LD": "10",
        "SV": "4+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Deathleaper is equipped with: Flesh hooks, Scything talons, Rending claws.",
  "weapons": [
    {
      "name": "Flesh hooks",
      "range": "6\"",
      "type": "Pistol 4",
      "s": "4",
      "ap": "0",
      "d": "1",
      "abilities": "Suppression"
    },
    {
      "name": "Piercing claws",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-3",
      "d": "1",
      "abilities": "Armor piercing(5+)"
    },
    {
      "name": "Scything talons",
      "range": "-",
      "type": "Melee",
      "s": "U",
      "ap": "-1",
      "d": "1",
      "abilities": "Flurry(1)"
    }
  ],
  "option_groups": [
    {
      "header": "May select one Special Biomorph",
      "constraint": {
        "type": "one"
      },
      "choices": [
        {
          "name": "Feeder Tendrils",
          "points": 5
        },
        {
          "name": "Synaptic Node",
          "points": 15
        },
        {
          "name": "Hardened Carapace",
          "points": 27
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
    "Deep Strike, Deflect, Hit & Run, Infiltrate, Move Through Cover, Parry, Stealth, Terrifying(-2), Use Cover",
    "Assassin: If all attacks are resolved against a single model, the Lictor may re-roll all to hit and to wound rolls.",
    "Chameleonic Skin: The model does not scatter when being set up via Deep Strike. Additionally, instead of using a \"Move & Shoot\" command, it always uses a \"Charge\" command and may still perform a 6\" Charge move after being set up via Deep Strike.",
    "Pheromone Trail: A friendly unit arriving within 6\" of this model via Deep strike does not scatter. The Lictor must be present on the table at the beginning of the battle round in order to use this rule.",
    "Unnatural Speed: The model has a 5+ invulnerability save."
  ],
  "unit_type": "Monstrous Infantry",
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
  "slot": "Elites",
  "default_size": 1,
  "min_cost": 180,
  "is_monster": false
};
