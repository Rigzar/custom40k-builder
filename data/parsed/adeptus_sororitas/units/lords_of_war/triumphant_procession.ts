/**
 * TRIUMPHANT PROCESSION — Lords of War
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const triumphantProcession: Unit = {
  "name": "Triumphant Procession",
  "models": [
    {
      "name": "Triumphant Procession",
      "points": 321,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "6\"",
        "WS": "2+",
        "BS": "2+",
        "S": "3",
        "T": "4",
        "W": "6",
        "I": "3",
        "A": "6",
        "LD": "10",
        "SV": "2+"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Triumphant Procession is equipped with: 6 Bolt pistols; Frag grenades; Krak grenades; Relic blades.",
  "weapons": [
    {
      "name": "Bolt pistol",
      "range": "12\"",
      "type": "Pistol 1",
      "s": "4",
      "ap": "-1",
      "d": "1",
      "abilities": "Master-crafted"
    },
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
      "name": "Relic blades",
      "range": "-",
      "type": "Melee",
      "s": "+2",
      "ap": "-3",
      "d": "2",
      "abilities": "Master-crafted"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Acts of Faith, Shield of Faith",
    "Palanquin Bearers: All damage against the model is reduced to 1.",
    "Praesidium Protectiva: The model gains a 4+ invulnerability save.",
    "Unbound Faith: While the Triumphant Procession is on the battlefield, all Acts of Faith are constantly active for all models with the rule of the same name."
  ],
  "unit_type": "Monstrous Infantry",
  "keywords": [
    "Lord of War"
  ],
  "is_vehicle": false,
  "is_character": false,
  "is_monster": true,
  "is_psyker": false,
  "has_armory_access": false,
  "champion_has_armory": false,
  "has_veteran_abilities": false,
  "veteran_required": false,
  "veteran_max": null,
  "locked_mark": null,
  "advisor": false,
  "slot": "Lords of War",
  "default_size": 1,
  "min_cost": 321
};
