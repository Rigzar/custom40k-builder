import type { ArchetypeRule } from '../archetypes/base';
import { BASE } from '../archetypes/base';

/**
 * Horus Heresy Loyal / Traitor books (alpha): the slot effects of each detachment that the rule table can carry.
 * Only structure is modelled here (which units count as Troops / Elites, slot caps, banned units); movement, reserve and
 * ability effects stay as the sheet's text. Two names the Space Marines and Chaos codices also use carry a " (HH)" suffix
 * (see scratch_cx/hh_codex/build_customisation.cjs), so the lookup by name cannot confuse them.
 */
const VETS = ['Legion Veteran Squad', 'Saturnine Terminator Squad', 'Legion Terminator Cataphractii Squad', 'Indomitus Terminator Squad'];
const TERMS = ['Saturnine Terminator Squad', 'Legion Terminator Cataphractii Squad', 'Indomitus Terminator Squad'];
const BIKES = ['Legion Sky-hunter Squadron', 'Outrider Squadron'];
const DREADS = ['Legion Contemptor Dreadnought', 'Castra Ferrum Dreadnought', 'Deredeo Dreadnought', 'Legion Leviathan Dreadnought', 'Legion Saturnine Dreadnought'];

const r = (over: Partial<ArchetypeRule>): ArchetypeRule => ({ ...BASE, ...over });

export const HH_ARCHETYPES: Record<string, ArchetypeRule> = {
  'Pride of the Legion': r({ troopsRemap: VETS }),
  'Armoured Spearhead': r({ troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Sicaran Battle Tank'] }),
  'Recon Demi-Company': r({ troopsRemap: ['Legion Scout Squad', 'Seeker Squad'] }),
  'Sky-hunter Phalanx': r({ troopsRemap: ['Legion Sky-hunter Squadron', 'Land Speeder Squadron'], bannedUnits: DREADS }),
  'Fury of the Ancients': r({ troopsRemap: ['Legion Contemptor Dreadnought'], banOtherTroops: true }),
  'Deathwing Conclave (The Unbroken Vow)': r({ troopsRemap: VETS }),
  'The Steel Fist': r({ troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Kratos Assault Tank'] }),
  'The Storm of War': r({ elitesRemap: ['Legion Tactical Squad', 'Legion Despoiler Squad', 'Legion Assault Squad'] }),
  "The Seeker's Arrow": r({ troopsRemap: BIKES }),
  "The Serpent's Bane": r({ troopsRemap: ['Seeker Squad'], banOtherTroops: true }),
  'Chogorian Brotherhood': r({ troopsRemap: BIKES }),
  'The Stone Gauntlet': r({ troopsRemap: ['Legion Breacher Squad'], banOtherTroops: true }),
  'The Head of the Gorgon': r({ slotCapOverride: { slot: 'Fast Attack', max: 1 } }),
  'The Covenant of Fire': r({ troopsRemap: ['Legion Tactical Support Squad'] }),
  'Decapitation Strike': r({ slotCapOverride: { slot: 'Heavy Support', max: 1 } }),
  'IIIrd Company Elite': r({ troopsRemap: ['Kakophoni Squad'] }),
  'The Swift Blade (HH)': r({ troopsRemap: ['Outrider Squadron'], bannedSlots: ['Heavy Support'] }),
  'Terror Assault': r({ troopsRemap: ['Legion Veteran Squad'], banOtherTroops: true }),
  'Last of the Serrated Sun': r({ troopsRemap: ['Centurion Command Squad'] }),
  'The Reaping': r({ troopsRemap: ['Legion Veteran Squad', 'Legion Heavy Support Squad'] }),
  'The Long March': r({ troopsRemap: TERMS }),
  'The Achaean Configuration': r({ troopsRemap: ['Castellax-Achea Automata'] }),
  'The Guard of the Crimson King': r({ troopsRemap: ['Legion Terminator Cataphractii Squad'] }),
};
