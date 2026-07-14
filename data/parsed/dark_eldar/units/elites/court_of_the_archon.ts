/**
 * COURT OF THE ARCHON — Elites
 *
 * SOURCE: Dark Eldar 1.01.ods, sheet "Court of the Archon". NEW unit in 1.01.
 * Retinue of 3-10 models in any combination of four types. One unit per Archon selection.
 * Sslyth have Armory access (per-model-type; not fully modelled by the single champion flag).
 */

import type { Unit } from '../../../../../src/types/data';

export const courtOfTheArchon: Unit = {
  "name": "Court of the Archon",
  "models": [
    {
      "name": "Lhaemaean",
      "points": 31,
      "min": 0,
      "max": 4,
      "stats": { "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "3", "W": "2", "I": "5", "A": "2", "LD": "8", "SV": "4+" }
    },
    {
      "name": "Medusae",
      "points": 38,
      "min": 0,
      "max": 4,
      "stats": { "M": "6\"", "WS": "3+", "BS": "3+", "S": "3", "T": "3", "W": "2", "I": "5", "A": "1", "LD": "8", "SV": "4+" }
    },
    {
      "name": "Sslyth",
      "points": 53,
      "min": 0,
      "max": 6,
      "stats": { "M": "6\"", "WS": "3+", "BS": "3+", "S": "5", "T": "5", "W": "3", "I": "3", "A": "3", "LD": "8", "SV": "4+" }
    },
    {
      "name": "Ur-Ghul",
      "points": 24,
      "min": 0,
      "max": 10,
      "stats": { "M": "6\"", "WS": "3+", "BS": "3+", "S": "4", "T": "3", "W": "2", "I": "5", "A": "4", "LD": "8", "SV": "6+" }
    }
  ],
  "variant_models": [],
  "equipped_with": "Every Lhaemaean is equipped with: Splinter pistol; Venom blade. Every Medusae is equipped with: Eyeburst. Every Ur-Ghul is equipped with: Rending claws.",
  "weapons": [
    { "name": "Eyeburst", "range": "9\"", "type": "Assault 4", "s": "5", "ap": "-2", "d": "1", "abilities": "Seeking, Suppression" },
    { "name": "Rending claws", "range": "-", "type": "Melee", "s": "U", "ap": "-2", "d": "1", "abilities": "Rending(5+)" },
    { "name": "Splinter pistol", "range": "12\"", "type": "Pistol 1", "s": "2", "ap": "0", "d": "1", "abilities": "Poison(3+)" },
    { "name": "Venom blade", "range": "-", "type": "Melee", "s": "U", "ap": "-4", "d": "1", "abilities": "Poison(2+)" }
  ],
  "option_groups": [],
  "abilities": [
    "Bodyguard (Sslyth only), Berserk(5+) (Sslyth and Ur-Ghul only), Furious Charge (Ur-Ghul only), Massive(1) (Sslyth only), Power through Pain",
    "Mistress of Poisons: While a Lhaemaean is alive in the unit, all weapons gain the \"Poison(2+)\" ability.",
    "For every Archon selection, the army may include one Court of the Archon unit. The unit consists of 3 to 10 models in any combination.",
    "Sslyth have access to weapons from the Armory."
  ],
  "unit_type": "Infantry",
  "keywords": [
    "Kabal"
  ],
  "is_vehicle": false,
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
  "slot": "Elites",
  "default_size": 3,
  "min_cost": 72
};
