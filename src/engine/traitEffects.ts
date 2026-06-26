import type { Unit } from '../types/data';
import { CSM_TRAIT_EFFECTS } from './codex_csm/traits';
import { CD_TRAIT_EFFECTS } from './traits/chaos_daemons';
import { SM_TRAIT_EFFECTS } from './traits/space_marines';
import { SORORITAS_TRAIT_EFFECTS } from './traits/adeptus_sororitas';
import { ORKS_TRAIT_EFFECTS } from './traits/orks';
import { GSC_TRAIT_EFFECTS } from './traits/genestealer_cults';
import { ELDAR_TRAIT_EFFECTS } from './traits/eldar';
import { VOTANN_TRAIT_EFFECTS } from './traits/leagues_of_votann';
import { ADMECH_TRAIT_EFFECTS } from './traits/adeptus_mechanicus';
import { IG_TRAIT_EFFECTS } from './traits/imperial_guard';
import { TAU_TRAIT_EFFECTS } from './traits/tau_empire';
import { NECRONS_TRAIT_EFFECTS } from './traits/necrons';
import { DARK_ELDAR_TRAIT_EFFECTS } from './traits/dark_eldar';

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
  ...SORORITAS_TRAIT_EFFECTS,
  ...ORKS_TRAIT_EFFECTS,
  ...GSC_TRAIT_EFFECTS,
  ...ELDAR_TRAIT_EFFECTS,
  ...VOTANN_TRAIT_EFFECTS,
  ...ADMECH_TRAIT_EFFECTS,
  ...IG_TRAIT_EFFECTS,
  ...TAU_TRAIT_EFFECTS,
  ...NECRONS_TRAIT_EFFECTS,
  ...DARK_ELDAR_TRAIT_EFFECTS,

  // ── Adeptus Mechanicus ───────────────────────────────────────────────────────
  // (see ./traits/adeptus_mechanicus.ts — spread above)

  // ── Adeptus Sororitas ────────────────────────────────────────────────────────
  // (see ./traits/adeptus_sororitas.ts — spread above)

  // ── Dark Eldar ───────────────────────────────────────────────────────────────
  // (see ./traits/dark_eldar.ts — spread above)

  // ── Eldar ────────────────────────────────────────────────────────────────────
  // (see ./traits/eldar.ts — spread above)

  // ── Genestealer Cults ────────────────────────────────────────────────────────
  // (see ./traits/genestealer_cults.ts — spread above)

  // ── Imperial Guard ───────────────────────────────────────────────────────────
  // (see ./traits/imperial_guard.ts — spread above)

  // ── Leagues of Votann ────────────────────────────────────────────────────────
  // (see ./traits/leagues_of_votann.ts — spread above)

  // ── Necrons ──────────────────────────────────────────────────────────────────
  // (see ./traits/necrons.ts — spread above)

  // ── Orks ─────────────────────────────────────────────────────────────────────
  // (see ./traits/orks.ts — spread above)

  // ── Space Marines ────────────────────────────────────────────────────────────
  // (see ./traits/space-marines.ts — spread above)

  // ── Tau Empire ───────────────────────────────────────────────────────────────
  // (see ./traits/tau_empire.ts — spread above)
};
