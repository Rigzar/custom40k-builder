/**
 * ACOLYTE ICONWARD — HQ
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const acolyteIconward: Unit = {
  "name": "Acolyte Iconward",
  "models": [
    {
      "name": "Acolyte Iconward",
      "points": 64,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "3+",
        "BS": "3+",
        "S": "4",
        "T": "4",
        "W": "3",
        "I": "4",
        "A": "3",
        "LD": "8",
        "SV": "5+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "An Acolyte Iconward is equipped with: -.",
  "weapons": [],
  "option_groups": [
    {
      "header": "Only one Acolyte Iconward per army.",
      "constraint": {
        "type": "unique_upgrade"
      },
      "choices": [],
      "inline_pts": null,
      "variant_link": null,
      "is_unique_per_army": true
    }
  ],
  "abilities": [
    "Ambush, Command Squad, Infiltrator, Use cover",
    "Nexus of Devotion: During each Reinforcement phase, 1D3 slain models return to the attached unit.",
    "Ringleader: You may select up to two units with this ability for a single HQ slot. Each unit may only be taken once.",
    "Sacred Cult Banner: The unit gains a bonus of +1 to Leadership and Combat resolutions. As long as the banner bearer is alive, Mission objectives that are held by this unit can not be contested by enemy units. Additionally, all models in the unot gain +1 Attack.",
    "Unquestioning Loyalty: This model may join any Genestealer Cults creature unit (regardless of their unit type). Additionally, that unit gains the \"Bodyguard\" ability."
  ],
  "unit_type": "Character Model, Infantry",
  "keywords": [],
  "is_vehicle": false,
  "is_character": true,
  "is_monster": false,
  "is_psyker": false,
  "has_armory_access": true,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "HQ",
  "default_size": 1,
  "min_cost": 64
};
