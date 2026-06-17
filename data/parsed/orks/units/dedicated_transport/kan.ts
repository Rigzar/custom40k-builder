/**
 * KAN — Dedicated Transport
 *
 * SOURCE: TODO — add canonical datasheet text here when auditing this unit.
 * (See chaos_sorcerer.ts for the full template with source text + engine status notes.)
 *
 */

import type { Unit } from '../../../../../src/types/data';

export const kan: Unit = {
  "name": "Kan",
  "models": [
    {
      "name": "Kan",
      "points": 102,
      "min": 1,
      "max": 1,
      "stats": {
        "M": "-",
        "WS": "-",
        "BS": "5+",
        "S": "5",
        "FRONT": "10",
        "SIDE": "10",
        "REAR": "10",
        "I": "-",
        "A": "-",
        "HP": "2"
      }
    }
  ],
  "variant_models": [],
  "equipped_with": "A Kan is a single model and equipped with: Kontrol Thrustas.",
  "weapons": [
    {
      "name": "Kontrol Thrustas",
      "range": "-",
      "type": "Melee",
      "s": "8",
      "ap": "-3",
      "d": "2",
      "abilities": "AT(2)"
    }
  ],
  "option_groups": [],
  "abilities": [
    "Deep Strike",
    "It's Raining Kans: Kans always start the game as reserves and are always set up via Deep Strike. Even if the played mission does not allow reinforcements and/or Deep Strike!",
    "Kontrolled Landing: A Kan must be initially placed at least 6\" away from any unit, enemy or friendly, when it Deep Strikes. If it then scatters to within 1\" of any unit, friendly or enemy, resolve D6 Hits with its Kontrol Thrustas weapon on the unit it has scattered into. The Kan then takes a Glancing Hit.",
    "Transport: This model has a transport capacity of 15 infantry models, 1 Deff Dread, or 3 Killa Kans.",
    "Ramshackle: Roll D6 when the vehicle is destroyed — 1-2: Kaboom! The vehicle explodes with a radius of 6\". 3-4: Kareen! Move the vehicle 3D6\" in a random direction and then Kaboom! The vehicle stops at the first unit it contacts. On a hit symbol the controlling player chooses direction. 5-6: Kerrunch! Passengers disembark unharmed; the vehicle remains as wreckage. If immobilized, the player may roll on this table with any command during their next activation.",
    "Unorked: A Kan cannot contest or hold mission objectives."
  ],
  "unit_type": "Vehicle",
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
  "slot": "Dedicated Transport",
  "default_size": 1,
  "min_cost": 102
};
