import type { Unit } from '../types/data';
import { CSM_TRAIT_EFFECTS } from './codex_csm/traits';
import { CD_TRAIT_EFFECTS } from './traits/chaos_daemons';
import { SM_TRAIT_EFFECTS } from './traits/space_marines';

export type AppliesTo = 'all' | 'creature' | 'vehicle' | 'character' | 'infantry' | 'monster';

export type TraitEffect =
  | { type: 'stat_mod';       stat: string; delta: number;                                applies_to: AppliesTo }
  | { type: 'inv_save';       value: number;                                               applies_to: AppliesTo }
  | { type: 'unit_ability';   name: string; desc?: string;                                applies_to: AppliesTo }
  | { type: 'weapon_ability'; name: string; weapon_type?: 'ranged' | 'melee' | 'bolt';   applies_to: AppliesTo };

function effectApplies(effect: TraitEffect, unit: Unit): boolean {
  switch (effect.applies_to) {
    case 'all':       return true;
    case 'creature':  return !unit.is_vehicle;
    case 'vehicle':   return unit.is_vehicle;
    case 'character': return unit.is_character;
    case 'infantry':  return !unit.is_vehicle && !unit.is_monster && !unit.is_character;
    case 'monster':   return unit.is_monster;
    default:          return false;
  }
}

/** Returns all TraitEffect entries for the given trait that apply to the given unit. */
export function getTraitEffects(traitName: string, unit: Unit): TraitEffect[] {
  const effects = TRAIT_EFFECTS[traitName];
  if (!effects) return [];
  return effects.filter(e => effectApplies(e, unit));
}

/**
 * All faction trait effects, keyed by trait name.
 * Each faction lives in its own file under engine/traits/.
 */
export const TRAIT_EFFECTS: Record<string, TraitEffect[]> = {
  ...CSM_TRAIT_EFFECTS,
  ...CD_TRAIT_EFFECTS,
  ...SM_TRAIT_EFFECTS,

  // ── Adeptus Mechanicus ───────────────────────────────────────────────────────
  // TODO

  // ── Adeptus Sororitas ────────────────────────────────────────────────────────
  // TODO

  // ── Dark Eldar ───────────────────────────────────────────────────────────────
  // TODO

  // ── Eldar ────────────────────────────────────────────────────────────────────
  // TODO

  // ── Genestealer Cults ────────────────────────────────────────────────────────
  // TODO

  // ── Imperial Guard ───────────────────────────────────────────────────────────
  // TODO

  // ── Leagues of Votann ────────────────────────────────────────────────────────
  // TODO

  // ── Necrons ──────────────────────────────────────────────────────────────────
  // TODO

  // ── Orks ─────────────────────────────────────────────────────────────────────
  // TODO

  // ── Space Marines ────────────────────────────────────────────────────────────
  // (see ./traits/space-marines.ts — spread above)

  // ── Tau Empire ───────────────────────────────────────────────────────────────
  // TODO
};
