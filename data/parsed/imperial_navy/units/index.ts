/**
 * imperial_navy - unit index.
 *
 * Each unit is a PURE JSON file next to this one, so the codex tooling can rewrite it from the
 * sheets without touching any TypeScript. This is the only .ts in the folder: it imports them
 * and exports `faction`, `slot_to_units` and `units`.
 *
 * To add a unit, add its .json and one line here.
 */

import type { Unit } from '../../../../src/types/data';

import hq_rogue_trader from './hq/rogue_trader.json';
import hq_voidmaster from './hq/voidmaster.json';
import troops_ratings from './troops/ratings.json';
import troops_voidsmen from './troops/voidsmen.json';
import troops_henchman_warband from './troops/henchman_warband.json';
import elites_acolytes from './elites/acolytes.json';
import elites_alien_world_scouts from './elites/alien_world_scouts.json';
import elites_arch_militant from './elites/arch-militant.json';
import elites_archaeotech_researchers from './elites/archaeotech_researchers.json';
import elites_arco_flagellants from './elites/arco-flagellants.json';
import elites_breachers from './elites/breachers.json';
import elites_chirurgeons from './elites/chirurgeons.json';
import elites_crusaders from './elites/crusaders.json';
import elites_deathcult_assassins from './elites/deathcult_assassins.json';
import elites_eldar_outcast from './elites/eldar_outcast.json';
import elites_exorcists from './elites/exorcists.json';
import elites_impressed_ogryns from './elites/impressed_ogryns.json';
import elites_jokaero_weaponsmiths from './elites/jokaero_weaponsmiths.json';
import elites_missionaries from './elites/missionaries.json';
import elites_mystics from './elites/mystics.json';
import elites_penitents from './elites/penitents.json';
import elites_psykers from './elites/psykers.json';
import elites_sages from './elites/sages.json';
import elites_servitors from './elites/servitors.json';
import elites_xenologists from './elites/xenologists.json';
import elites_daemonhosts from './elites/daemonhosts.json';
import dedicated_transport_valkyrie from './dedicated_transport/valkyrie.json';
import flyers_vendetta from './flyers/vendetta.json';
import dedicated_transport_arvus from './dedicated_transport/arvus.json';
import flyers_avenger from './flyers/avenger.json';
import flyers_lightning from './flyers/lightning.json';
import flyers_thunderbolt from './flyers/thunderbolt.json';
import flyers_vulture from './flyers/vulture.json';
import elites_armiger from './elites/armiger.json';

export const faction = "Imperial Navy";

export const slot_to_units: Record<string, string[]> = {
  "HQ": [
    "Rogue Trader",
    "Voidmaster"
  ],
  "Troops": [
    "Ratings",
    "Voidsmen",
    "Henchman Warband"
  ],
  "Elites": [
    "Acolytes",
    "Alien World Scouts",
    "Arch-Militant",
    "Archaeotech Researchers",
    "Arco-flagellants",
    "Breachers",
    "Chirurgeons",
    "Crusaders",
    "Deathcult Assassins",
    "Eldar Outcast",
    "Exorcists",
    "Impressed Ogryns",
    "Jokaero Weaponsmiths",
    "Missionaries",
    "Mystics",
    "Penitents",
    "Psykers",
    "Sages",
    "Servitors",
    "Xenologists",
    "Daemonhosts",
    "Armiger"
  ],
  "Fast Attack": [],
  "Heavy Support": [],
  "Dedicated Transport": [
    "Arvus",
    "Valkyrie"
  ],
  "Fortifications": [],
  "Flyers": [
    "Avenger",
    "Lightning",
    "Thunderbolt",
    "Vulture",
    "Vendetta"
  ]
};

/** All units keyed by name. */
export const units: Record<string, Unit> = {
  "Rogue Trader": hq_rogue_trader as Unit,
  "Voidmaster": hq_voidmaster as Unit,
  "Ratings": troops_ratings as Unit,
  "Voidsmen": troops_voidsmen as Unit,
  "Henchman Warband": troops_henchman_warband as Unit,
  "Acolytes": elites_acolytes as Unit,
  "Alien World Scouts": elites_alien_world_scouts as Unit,
  "Arch-Militant": elites_arch_militant as Unit,
  "Archaeotech Researchers": elites_archaeotech_researchers as Unit,
  "Arco-flagellants": elites_arco_flagellants as Unit,
  "Breachers": elites_breachers as Unit,
  "Chirurgeons": elites_chirurgeons as Unit,
  "Crusaders": elites_crusaders as Unit,
  "Deathcult Assassins": elites_deathcult_assassins as Unit,
  "Eldar Outcast": elites_eldar_outcast as Unit,
  "Exorcists": elites_exorcists as Unit,
  "Impressed Ogryns": elites_impressed_ogryns as Unit,
  "Jokaero Weaponsmiths": elites_jokaero_weaponsmiths as Unit,
  "Missionaries": elites_missionaries as Unit,
  "Mystics": elites_mystics as Unit,
  "Penitents": elites_penitents as Unit,
  "Psykers": elites_psykers as Unit,
  "Sages": elites_sages as Unit,
  "Servitors": elites_servitors as Unit,
  "Xenologists": elites_xenologists as Unit,
  "Daemonhosts": elites_daemonhosts as Unit,
  "Valkyrie": dedicated_transport_valkyrie as Unit,
  "Vendetta": flyers_vendetta as Unit,
  "Arvus": dedicated_transport_arvus as Unit,
  "Avenger": flyers_avenger as Unit,
  "Lightning": flyers_lightning as Unit,
  "Thunderbolt": flyers_thunderbolt as Unit,
  "Vulture": flyers_vulture as Unit,
  "Armiger": elites_armiger as Unit,
};
