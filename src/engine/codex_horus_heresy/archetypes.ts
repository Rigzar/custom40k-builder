import type { ArchetypeRule } from '../archetypes/base';
import { BASE } from '../archetypes/base';

const r = (over: Partial<ArchetypeRule>): ArchetypeRule => ({ ...BASE, ...over });

/** Every unit of Terminator armour that the sheets list as an Elites choice, for the "any unit composed entirely of Terminator armour" line of Pride of the Legion. */
const TERMINATOR_ELITES = ['Legion Terminator Cataphractii Squad', 'Legion Tartaros Terminator Squad', 'Saturnine Terminator Squad', 'Firedrake Terminator Squad', 'Crimson Paladins Squad', 'Red Butcher Terminators', 'Deathshroud Terminator Squad', 'Scarab Occult Terminator Squad'];

/**
 * Horus Heresy Loyal / Traitor books (alpha): the slot effects of each archetype that the rule table can carry, with the names the sheets use now
 * (the nine general archetypes of Custom40k plus one per Legion). Only structure is modelled here (which units count as Troops, slot caps); movement,
 * reserve, weapon-swap and ability lines stay as the sheet's text. "Drop Pod Assault" carries a " (HH)" suffix (see scratch_cx/hh_codex/build_customisation.cjs)
 * so the lookup by name cannot confuse it with the Space Marines archetype. The Legion archetypes force their Legacy through their own text ('Must select "Legacy of X"').
 */
export const HH_ARCHETYPES: Record<string, ArchetypeRule> = {
  'Armoured Spearhead': r({ requiresLegacy: true,  troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Sicaran Battle Tank'] }),
  // "access to all Robot units from the Horus Heresy Mechanicum supplement" = Forces of the Machine God (loader key legio_titanicus); the only Robot of that supplement is the Thanatar Siege-Automata.
  // The Castellax Battle-automata Maniple the sheet makes Troops is not in that supplement's data.
  'Brethren of Iron': r({ requiresLegacy: true, alliedFaction: 'legio_titanicus', alliedMarkFilter: 'all', alliedUnitsOnly: ['Thanatar Siege-Automata'] }),
  'Death from Above': r({ requiresLegacy: true,  troopsRemap: ['Legion Assault Squad'], troopsCount: 'remap' }),
  'Drop Pod Assault (HH)': r({ requiresLegacy: true, }),
  'Legion Specialists': r({ requiresLegacy: true, hqOverride: [1, 3], slotBonus: [{ slot: 'Elites', add: 1 }] }),   // 1-3 HQ and 0-4 Elites in the first AOP
  'Outrider Phalanx': r({ requiresLegacy: true,  troopsRemap: ['Outrider Squadron', 'Legion Sky-hunter Squadron'], lowMoveMustEmbark: {} }),
  'Pride of the Legion': r({ requiresLegacy: true,  troopsRemap: ['Legion Veteran Squad', ...TERMINATOR_ELITES], troopsCount: 'remap', slotCaps: [{ slot: 'Heavy Support', max: 1 }, { slot: 'Fast Attack', max: 1 }] }),
  'Recon Demi-Company': r({ requiresLegacy: true,  troopsRemap: ['Legion Scout Squad', 'Seeker Squad'] }),
  'Underworld Assault': r({ requiresLegacy: true, }),
  // the Legion archetypes: their weapon and ability lines are text; three of them also make a unit Troops
  "Emperor's Children": r({ troopsRemap: ['Kakophoni Squad'], troopsCount: 'remap' }),
  'Word Bearers': r({ troopsRemap: ['Gal Vorbak'], troopsCount: 'remap' }),
  'Thousand Sons': r({ troopsRemap: ['Castellax-Achea Automata'], troopsCount: 'remap' }),
  // two Legacies and a third Trait to choose from the list (an army takes from 0 to 2)
  'Shattered Legions': r({ twoLegacies: true, archetypeTraitBonus: 1 }),
  'Blackshields': r({ twoLegacies: true, archetypeTraitBonus: 1 }),
};

/** The Legacies of these books give no Troops of their own any more (the Legion archetypes do). Kept as an empty table for the lookup in archetypes/index.ts. */
export const HH_LEGACY_TROOPS: Record<string, string[]> = {};

/** The Legion of the army gives its benefits as a priced choice on every datasheet (see the "May receive the benefits of the Legion of the army" option), not as an automatic Mark of the Legacy. */
type LegionMark = Pick<ArchetypeRule, 'legionTerm' | 'statMods' | 'statModsExceptUnits'>;
export function hhMarkFor(_legacy: string | null | undefined, _faction: string): LegionMark | null {
  return null;
}
