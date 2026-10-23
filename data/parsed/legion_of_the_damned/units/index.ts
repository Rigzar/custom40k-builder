/**
 * legion_of_the_damned - unit index.
 *
 * Each unit is a PURE JSON file next to this one, so the codex tooling can rewrite it from the
 * sheets without touching any TypeScript. This is the only .ts in the folder: it imports them
 * and exports `faction`, `slot_to_units` and `units` exactly as the regular factions do.
 * Everything that is not a unit is in ../supplement.json.
 *
 * To add a unit, add its .json and one line here.
 */

import type { Unit } from '../../../../src/types/data';

import hq_lieutenant from './hq/lieutenant.json';
import troops_legion_of_the_damned from './troops/legion_of_the_damned.json';
import elites_ancient from './elites/ancient.json';
import elites_dreadnought from './elites/dreadnought.json';
import fast_attack_bike_squad from './fast_attack/bike_squad.json';
import heavy_support_devastator_squad from './heavy_support/devastator_squad.json';
import dedicated_transport_rhino from './dedicated_transport/rhino.json';

export const faction = "Legion of the Damned";

export const slot_to_units: Record<string, string[]> = {
  "HQ": [
    "Lieutenant"
  ],
  "Troops": [
    "Legion of the Damned"
  ],
  "Elites": [
    "Ancient",
    "Dreadnought"
  ],
  "Fast Attack": [
    "Bike Squad"
  ],
  "Heavy Support": [
    "Devastator Squad"
  ],
  "Dedicated Transport": [
    "Rhino"
  ]
};

export const units: Record<string, Unit> = {
  "Lieutenant": hq_lieutenant as Unit,
  "Legion of the Damned": troops_legion_of_the_damned as Unit,
  "Ancient": elites_ancient as Unit,
  "Dreadnought": elites_dreadnought as Unit,
  "Bike Squad": fast_attack_bike_squad as Unit,
  "Devastator Squad": heavy_support_devastator_squad as Unit,
  "Rhino": dedicated_transport_rhino as Unit,
};
