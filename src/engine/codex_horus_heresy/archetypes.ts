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

const NO_FORT = ['Fortifications'];
const r = (over: Partial<ArchetypeRule>): ArchetypeRule => ({ ...BASE, ...over });

/** The Mark of a Legion ("Mark of World Eaters (WE)"): every unit of the army has it, like a Mark of Chaos, and it costs points per model and per Wound; the text is the Special rules entry of the sheet. */
const term = (name: string, abbr: string, perWound: number, note: string, vehicleFlat?: number) => ({
  name, abbr, perWound, vehicleFlat,
  note: `Mark of ${name} (${abbr}): ${note} Costs ${perWound} point${perWound === 1 ? '' : 's'} per model and per Wound${vehicleFlat ? `, ${vehicleFlat} points per vehicle` : ''}.`,
});

export const HH_ARCHETYPES: Record<string, ArchetypeRule> = {
  'Pride of the Legion': r({ troopsRemap: VETS, bannedSlots: NO_FORT, slotCaps: [{ slot: 'Heavy Support', max: 1 }, { slot: 'Fast Attack', max: 1 }] }),
  'Armoured Spearhead': r({ troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Sicaran Battle Tank'] }),
  'Recon Demi-Company': r({ troopsRemap: ['Legion Scout Squad', 'Seeker Squad'], bannedSlots: NO_FORT }),
  'Drop Pod Assault (HH)': r({ bannedSlots: NO_FORT }),
  "Angel's Wrath": r({ bannedSlots: NO_FORT }),
  'Underworld Assault': r({ bannedSlots: NO_FORT }),
  'Sky-hunter Phalanx': r({ troopsRemap: ['Legion Sky-hunter Squadron', 'Land Speeder Squadron'], bannedUnits: DREADS, bannedSlots: NO_FORT }),
  'Fury of the Ancients': r({ troopsRemap: ['Legion Contemptor Dreadnought'], banOtherTroops: true, bannedSlots: NO_FORT, slotCaps: [{ slot: 'Fast Attack', max: 1 }, { slot: 'Heavy Support', max: 1 }] }),
  'Deathwing Conclave (The Unbroken Vow)': r({ troopsRemap: VETS }),
  'The Steel Fist (Dark Angels)': r({ troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Kratos Assault Tank'] }),
  'The Storm of War (Dark Angels)': r({ elitesRemap: ['Legion Tactical Squad', 'Legion Despoiler Squad', 'Legion Assault Squad'] }),
  "The Seeker's Arrow (Dark Angels)": r({ troopsRemap: BIKES, slotCapOverride: { slot: 'Heavy Support', max: 1 } }),
  "The Serpent's Bane (Dark Angels)": r({ troopsRemap: ['Seeker Squad'], banOtherTroops: true }),
  'White Scars': r({ troopsRemap: BIKES }),
  'Hammerfall Strike Force (Imperial Fists)': r({ bannedSlots: NO_FORT }),
  'Blood Angels': r({ bannedSlots: NO_FORT }),
  'The Stone Gauntlet (Imperial Fists)': r({ troopsRemap: ['Legion Breacher Squad'], banOtherTroops: true }),
  'Iron Hands': r({ slotCapOverride: { slot: 'Fast Attack', max: 1 } }),
  'The Covenant of Fire (Salamanders)': r({ troopsRemap: ['Legion Tactical Support Squad'] }),
  'Raven Guard': r({ slotCapOverride: { slot: 'Heavy Support', max: 1 }, bannedSlots: NO_FORT }),
  "Emperor's Children": r({
  }),
  // Death Guard: its archetype gives no slot effect; the Mark comes with the Legacy
  'World Eaters': r({
    slotCapOverride: { slot: 'Heavy Support', max: 1 },
  }),
  'The Swift Blade (Night Lords)': r({ troopsRemap: ['Outrider Squadron'], bannedSlots: ['Heavy Support'] }),
  'Terror Assault (Night Lords)': r({ troopsRemap: ['Legion Veteran Squad'], banOtherTroops: true }),
  'Word Bearers': r({
  }),
  // two Legacies and a third Trait to choose from the list (an army takes from 0 to 2)
  'Shattered Legions': r({ twoLegacies: true, archetypeTraitBonus: 1 }),
  'Blackshields': r({ twoLegacies: true, archetypeTraitBonus: 1 }),
  'Thousand Sons': r({ unitsArePsykers: { discipline: 'Prosperine Arcana' } }),
  'Sons of Horus': r({
  }),
};

/** The units that count as Troops with the Legacy of a Legion (its Mark): the archetype no longer gives them. */
export const HH_LEGACY_TROOPS: Record<string, string[]> = {
  'Legacy of the Phoenician': ['Kakophoni Squad'],
  'Legacy of the Lord of Red Sands': ['Rampager Squad'],
  'Legacy of the Archtraitor': ['Gal Vorbak'],
  'Legacy of the Warmaster': [...TERMS, 'Legion Assault Squad'],
  'Legacy of the Crimson King': ['Castellax-Achea Automata'],
};

/** The Legacies that give the Mark of their Legion. Only the Legacy gives it: the archetype of the Legion no longer does. */
const LEGACY_LEGION: Record<string, string> = {
  'Legacy of the Death Lord': 'Death Guard',
  "Legacy of the Phoenician": "Emperor's Children",
  'Legacy of the Lord of Red Sands': 'World Eaters',
  'Legacy of the Archtraitor': 'Word Bearers',
  'Legacy of the Warmaster': 'Sons of Horus',
};

type LegionMark = Pick<ArchetypeRule, 'legionTerm' | 'statMods' | 'statModsExceptUnits'>;
/** "Mark of World Eaters (WE)": what every unit of the army gets from the Legacy of that Legion (a stat, and points per model and per Wound). */
const LEGION_MARKS: Record<string, LegionMark> = {
  "Emperor's Children": {
    legionTerm: term("Emperor's Children", 'EC', 1, 'the model gains +1" Movement.'),
    statMods: [{ stat: 'M', delta: 1, creatureOnly: true }],
  },
  "Death Guard": {
    legionTerm: term('Death Guard', 'DG', 2, 'the model gains +1 Toughness; a character model or Monstrous Creature also gains +1 Wound. Vehicles may roll 2D6 during each Reinforcement phase: on a 7+ they may remove a "Crew Shaken" result, one "Engine Damage" or one "Weapon Damage" result, or restore one lost HP. Units automatically pass Dangerous Terrain tests.', 10),
    statMods: [{ stat: 'T', delta: 1, creatureOnly: true }, { stat: 'W', delta: 1, characterOrMonsterOnly: true }],
  },
  "World Eaters": {
    legionTerm: term('World Eaters', 'WE', 1, 'the model gains +1 Attack; a character model also gains +1 Strength.'),
    statMods: [{ stat: 'A', delta: 1, creatureOnly: true }, { stat: 'S', delta: 1, characterOnly: true }],
    statModsExceptUnits: ['Red Butcher Terminators'],
  },
  "Word Bearers": {
    legionTerm: term('Word Bearers', 'WB', 1, 'the model gains +1 Leadership.'),
    statMods: [{ stat: 'LD', delta: 1, creatureOnly: true }],
  },
  "Sons of Horus": {
    legionTerm: term('Sons of Horus', 'SoH', 1, 'the model gains +1" Movement.'),
    statMods: [{ stat: 'M', delta: 1, creatureOnly: true }],
  },
};

/** The Mark of a Legion that applies to the units of an army: the one of the Legion of the chosen Legacy (Rigzar 2026-11-01: "the Marks come from the Legacy, not from the archetype"). Only the Horus Heresy books have them. */
export function hhMarkFor(legacy: string | null | undefined, faction: string): LegionMark | null {
  if (!faction.startsWith('Horus Heresy')) return null;
  return LEGION_MARKS[LEGACY_LEGION[legacy ?? ''] ?? ''] ?? null;
}
