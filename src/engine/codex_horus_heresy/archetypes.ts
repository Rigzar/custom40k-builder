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

/** The Legion term an archetype gives to every unit ("Legion: World Eaters (WE)"); the text is the Special rules entry of the sheet. */
const term = (name: string, abbr: string, perWound: number, note: string, vehicleFlat?: number) => ({
  name, abbr, perWound, vehicleFlat,
  note: `Legion: ${name} (${abbr}): ${note} Costs ${perWound} point${perWound === 1 ? '' : 's'} per model and per Wound${vehicleFlat ? `, ${vehicleFlat} points per vehicle` : ''}.`,
});

export const HH_ARCHETYPES: Record<string, ArchetypeRule> = {
  'Pride of the Legion': r({ troopsRemap: VETS }),
  'Armoured Spearhead': r({ troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Sicaran Battle Tank'] }),
  'Recon Demi-Company': r({ troopsRemap: ['Legion Scout Squad', 'Seeker Squad'] }),
  'Sky-hunter Phalanx': r({ troopsRemap: ['Legion Sky-hunter Squadron', 'Land Speeder Squadron'], bannedUnits: DREADS }),
  'Fury of the Ancients': r({ troopsRemap: ['Legion Contemptor Dreadnought'], banOtherTroops: true }),
  'Deathwing Conclave (The Unbroken Vow)': r({ troopsRemap: VETS }),
  'The Steel Fist (Dark Angels)': r({ troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Kratos Assault Tank'] }),
  'The Storm of War (Dark Angels)': r({ elitesRemap: ['Legion Tactical Squad', 'Legion Despoiler Squad', 'Legion Assault Squad'] }),
  "The Seeker's Arrow (Dark Angels)": r({ troopsRemap: BIKES }),
  "The Serpent's Bane (Dark Angels)": r({ troopsRemap: ['Seeker Squad'], banOtherTroops: true }),
  'White Scars': r({ troopsRemap: BIKES }),
  'The Stone Gauntlet (Imperial Fists)': r({ troopsRemap: ['Legion Breacher Squad'], banOtherTroops: true }),
  'Iron Hands': r({ slotCapOverride: { slot: 'Fast Attack', max: 1 } }),
  'The Covenant of Fire (Salamanders)': r({ troopsRemap: ['Legion Tactical Support Squad'] }),
  'Raven Guard': r({ slotCapOverride: { slot: 'Heavy Support', max: 1 } }),
  "Emperor's Children": r({
    troopsRemap: ['Kakophoni Squad'],
    legionTerm: term("Emperor's Children", 'EC', 1, 'the model gains +1" Movement.'),
    statMods: [{ stat: 'M', delta: 1, creatureOnly: true }],
  }),
  'Death Guard': r({
    legionTerm: term('Death Guard', 'DG', 2, 'the model gains +1 Toughness; a character model or Monstrous Creature also gains +1 Wound. Vehicles may roll 2D6 during each Reinforcement phase: on a 7+ they may remove a "Crew Shaken" result, one "Engine Damage" or one "Weapon Damage" result, or restore one lost HP. Units automatically pass Dangerous Terrain tests.', 10),
    statMods: [{ stat: 'T', delta: 1, creatureOnly: true }, { stat: 'W', delta: 1, characterOrMonsterOnly: true }],
  }),
  'World Eaters': r({
    troopsRemap: ['Rampager Squad'], slotCapOverride: { slot: 'Heavy Support', max: 1 },
    legionTerm: term('World Eaters', 'WE', 1, 'the model gains +1 Attack; a character model also gains +1 Strength.'),
    statMods: [{ stat: 'A', delta: 1, creatureOnly: true }, { stat: 'S', delta: 1, characterOnly: true }],
  }),
  'The Swift Blade (Night Lords)': r({ troopsRemap: ['Outrider Squadron'], bannedSlots: ['Heavy Support'] }),
  'Terror Assault (Night Lords)': r({ troopsRemap: ['Legion Veteran Squad'], banOtherTroops: true }),
  'Word Bearers': r({
    troopsRemap: ['Dark Brethren'],
    legionTerm: term('Word Bearers', 'WB', 1, 'the model gains +1 Leadership.'),
    statMods: [{ stat: 'LD', delta: 1, creatureOnly: true }],
  }),
  'Sons of Horus': r({
    troopsRemap: [...TERMS, 'Legion Assault Squad'],
    legionTerm: term('Sons of Horus', 'SoH', 1, 'the model gains +1" Movement.'),
    statMods: [{ stat: 'M', delta: 1, creatureOnly: true }],
  }),
  'Thousand Sons': r({}),
};
