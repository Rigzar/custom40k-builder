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
  'Armoured Spearhead': r({ requiresLegacy: true, troopsRemap: ['Legion Predator'], elitesRemap: ['Legion Sicaran Battle Tank'] }),
  // "access to all Robot units from the Horus Heresy Mechanicum supplement" = Forces of the Machine God (loader key legio_titanicus); the only Robot of that supplement is the Thanatar Siege-Automata.
  // The Castellax Battle-automata Maniple the sheet makes Troops is not in that supplement's data.
  'Brethren of Iron': r({ requiresLegacy: true, alliedFaction: 'legio_titanicus', alliedMarkFilter: 'all', alliedUnitsOnly: ['Thanatar Siege-Automata'] }),
  'Death from Above': r({ requiresLegacy: true, troopsRemap: ['Legion Assault Squad'], troopsCount: 'remap' }),
  'Drop Pod Assault (HH)': r({ requiresLegacy: true }),
  'Legion Specialists': r({ requiresLegacy: true, hqOverride: [1, 3], slotBonus: [{ slot: 'Elites', add: 1 }] }),   // 1-3 HQ and 0-4 Elites in the first AOP
  'Outrider Phalanx': r({ requiresLegacy: true, troopsRemap: ['Outrider Squadron', 'Legion Sky-hunter Squadron'], lowMoveMustEmbark: {} }),
  'Pride of the Legion': r({ requiresLegacy: true, troopsRemap: ['Legion Veteran Squad', ...TERMINATOR_ELITES], troopsCount: 'remap', slotCaps: [{ slot: 'Heavy Support', max: 1 }, { slot: 'Fast Attack', max: 1 }] }),
  'Recon Demi-Company': r({ requiresLegacy: true, troopsRemap: ['Legion Scout Squad', 'Seeker Squad'] }),
  'Underworld Assault': r({ requiresLegacy: true }),
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

// ---------------------------------------------------------------------------------------------------------------------------------
// The mark of the Legion. The Legacy of the army gives it to EVERY unit, with all it brings (stats, abilities, its price), like a Mark of Chaos in the Chaos
// Space Marines; a special unit of a Legion has that Legion's mark locked. The values come from the Index of the sheet (build_customisation.cjs -> legion_marks).
// ---------------------------------------------------------------------------------------------------------------------------------
export interface LegionMark {
  legionTerm: NonNullable<ArchetypeRule['legionTerm']>;
  statMods: NonNullable<ArchetypeRule['statMods']>;
  /** Abilities every creature / every vehicle gains with the mark (Warded, Infiltrator for infantry only...). */
  creatureAbilities: string[];
  vehicleAbilities: string[];
  infantryOnlyAbilities: boolean;
  /** A character model, squad leader or Monstrous Creature becomes a psyker (Thousand Sons, Word Bearers). */
  makesPsykerChars: boolean;
  /** The Legion this mark belongs to (the mark badge of the card). */
  legion: string;
}

const REGISTRY = new Map<string, { legionOfLegacy: Record<string, string>; marks: Record<string, LegionMark> }>();

/** Called by the loader of a Horus Heresy book with its archetypes.json: the Legacy -> Legion map and the marks. */
export function registerHhMarks(faction: string, legacies: Array<{ name: string; armory_key?: string | null }>, legionMarks: Record<string, any> | undefined): void {
  const legionOfLegacy: Record<string, string> = {};
  for (const l of legacies) if (l.armory_key) legionOfLegacy[l.name] = l.armory_key;
  const marks: Record<string, LegionMark> = {};
  for (const [legion, m] of Object.entries<any>(legionMarks ?? {})) {
    const statMods: NonNullable<ArchetypeRule['statMods']> = [
      ...(m.all?.stat_mod ?? []).map((s: any) => ({ stat: s.stat, delta: s.delta, creatureOnly: true })),
      ...(m.char?.stat_mod ?? []).map((s: any) => ({ stat: s.stat, delta: s.delta, characterOrMonsterOnly: true, creatureOnly: true })),
      ...(m.veh?.stat_mod ?? []).map((s: any) => ({ stat: s.stat, delta: s.delta, vehicleOnly: true })),
    ];
    marks[legion] = {
      legion,
      legionTerm: { name: legion, abbr: m.abbr, note: m.note, perWound: 0, perModel: m.cost.unit, perCharacter: m.cost.char, vehicleFlat: m.cost.vehicle },
      statMods,
      creatureAbilities: m.all?.grants_abilities ?? [],
      vehicleAbilities: m.veh?.grants_abilities ?? [],
      infantryOnlyAbilities: !!m.all?.infantry_only,
      makesPsykerChars: !!m.char?.makes_psyker,
    };
  }
  REGISTRY.set(faction, { legionOfLegacy, marks });
}

/**
 * The mark that applies to a unit of an army: the Legion of the army's Legacy (the Legacy of the unit itself in Shattered Legions / Blackshields), or the Legion
 * a special unit belongs to (its mark is locked). Only the two alpha books have them.
 */
export function hhMarkFor(legacy: string | null | undefined, faction: string, unit?: { requires_legacy?: string; name?: string } | null): LegionMark | null {
  if (!faction?.startsWith('Horus Heresy:')) return null;
  const reg = REGISTRY.get(faction);
  if (!reg) return null;
  const legion = reg.legionOfLegacy[unit?.requires_legacy ?? legacy ?? ''];
  const mark = legion ? reg.marks[legion] ?? null : null;
  // a special unit of a Legion (it needs that Legacy): its mark is locked and its profile and price already include it - it carries the mark, no second bonus and no second charge
  if (mark && unit?.requires_legacy) {
    return { ...mark, statMods: [], creatureAbilities: [], vehicleAbilities: [], makesPsykerChars: false, legionTerm: { ...mark.legionTerm, perModel: 0, perCharacter: 0, vehicleFlat: 0 } };
  }
  return mark;
}

