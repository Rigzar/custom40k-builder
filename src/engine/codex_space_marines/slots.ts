/**
 * codex_space_marines/slots — category 1 of 5 in the codex.ts data model (Slot).
 *
 * Roster per slot, extracted PROGRAMMATICALLY from the live `data/parsed/space_marines/units/
 * <slot>/*.ts` files (not hand-transcribed from the digest — the digest itself has no §4a-style
 * roster table for SM, unlike CD's; production data is the ground truth here, mirroring the
 * "production JSON canonical" architecture decision). Cross-checked against `space_marines.md`
 * digest §1/§4-6 mentions (Deathwing Knights, Blood Claws, Inceptor, Terminator Squad, etc. all
 * appear where expected) — zero drift found, no typos this time (unlike CD's Feculent/Daemon
 * Brutes catches).
 *
 * 8 slots populated, 0 empty (unlike CD which had 2 empty slots — SM exercises every category
 * including Flyers, which CD doesn't have at all).
 */

export interface SmSlotEntry {
  slot: string;
  units: string[];
  notes?: string;
}

export const SM_SLOTS: SmSlotEntry[] = [
  { slot: 'HQ', units: ['Captain Dreadnought', 'Chaplain', 'Chaplain Dreadnought', "Emperor's Champion", 'Librarian', 'Librarian Dreadnought', 'Lieutenant'] },
  { slot: 'Troops', units: ['Assault Intercessor Squad', 'Blood Claws', 'Grey Hunters', 'Heavy Intercessor Squad', 'Indomitus Crusader Squad', 'Infiltrator Squad', 'Intercessor Squad', 'Scout Squad', 'Tactical Squad'] },
  { slot: 'Elites', units: ['Aggressor Squad', 'Ancient', 'Apothecary', 'Company Champion', 'Death Company', 'Deathwing Knights', 'Dreadnought', 'Honor Guard', 'Invictor Battlesuit', 'Ironclad Dreadnought', 'Judicar', 'Kill Team Veterans', 'Redemptor Dreadnought', 'Reiver Marines', 'Techmarine', 'Terminator Squad', 'Wolf Scout Squad'] },
  { slot: 'Fast Attack', units: ['Assault Squad', 'Bike Squad', 'Inceptor Squad', 'Infernus Squad', 'Invader-Quad', 'Land Speeder', 'Outrider Bikes', 'Ravenwing Black Knights', 'Razorback Rikarius', 'Storm Speeder', 'Suppressor Squad', 'Wolf Companions'] },
  { slot: 'Heavy Support', units: ['Centurion Devastator Squad', 'Desolation Squad', 'Devastator Squad', 'Eliminator Squad', 'Eradicator Squad', 'Firestrike Servo-turret', 'Gladiator', 'Hellblaster Squad', 'Land Raider', 'Land Raider Ares', 'Land Raider Crusader', 'Land Raider Redeemer', 'Predator', 'Repulsor', 'Repulsor Executioner', 'Thunderfire Cannon', 'Vindicator', 'Whirlwind'] },
  { slot: 'Dedicated Transport', units: ['Drop Pod', 'Impulsor', 'Land Speeder Storm', 'Razorback', 'Rhino'] },
  { slot: 'Fortifications', units: ['Hammerfall Bunker'] },
  { slot: 'Flyers', units: ['Fire Raptor', 'Nephilim Jetfighter', 'Stormhawk Interceptor', 'Stormraven Gunship', 'Stormtalon Gunship'] },
];
