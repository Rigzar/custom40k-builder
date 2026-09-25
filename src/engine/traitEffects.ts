import type { Unit } from '../types/data';
import { CSM_TRAIT_EFFECTS } from './codex_csm/traits';
import { CD_TRAIT_EFFECTS } from './codex_chaos_daemons/traits';
import { SM_TRAIT_EFFECTS } from './codex_space_marines/traits';
import { SORORITAS_TRAIT_EFFECTS } from './codex_adeptus_sororitas/traits';
import { ORKS_TRAIT_EFFECTS } from './codex_orks/traits';
import { GSC_TRAIT_EFFECTS } from './codex_genestealer_cults/traits';
import { ELDAR_TRAIT_EFFECTS } from './codex_eldar/traits';
import { VOTANN_TRAIT_EFFECTS } from './codex_leagues_of_votann/traits';
import { ADMECH_TRAIT_EFFECTS } from './codex_adeptus_mechanicus/traits';
import { IG_TRAIT_EFFECTS } from './codex_imperial_guard/traits';
import { TAU_TRAIT_EFFECTS } from './codex_tau_empire/traits';
import { NECRONS_TRAIT_EFFECTS } from './codex_necrons/traits';
import { DARK_ELDAR_TRAIT_EFFECTS } from './codex_dark_eldar/traits';

export type AppliesTo = 'all' | 'creature' | 'vehicle' | 'character' | 'infantry' | 'monster' | 'psyker';

export type TraitEffect =
  | { type: 'stat_mod';       stat: string; delta: number;                                applies_to: AppliesTo }
  | { type: 'inv_save';       value: number;                                               applies_to: AppliesTo }
  | { type: 'unit_ability';   name: string; desc?: string;                                applies_to: AppliesTo }
  | { type: 'weapon_ability'; name: string; weapon_type?: 'ranged' | 'melee' | 'bolt';   applies_to: AppliesTo }
  /**
   * The trait hands the unit an item from its own faction's general Armory, free of charge —
   * e.g. IG "Heavy Infantry": "The unit gains Krak grenades and Plate armor." `item` must match
   * an Armory entry by name; weapons are added to the profile, equipment runs through
   * parseEquipMods like a bought item (so "4+ armor save" text actually moves the save).
   */
  | { type: 'grant_armory_item'; item: string;                                          applies_to: AppliesTo }
  /**
   * The trait gives every unit that carries `replaces` a free swap into `into` — a real option
   * group on the card, not a sentence.
   *
   * ONE trait in the game is worded this way, Imperial Guard's CLOSE COMBAT SPECIALISTS: "Each
   * model may swap their Lasgun for a Las pistol and a Close combat weapon." It was filed as a
   * `unit_ability`, so the text appeared and the swap did not exist. Reported by Skele on
   * Discord, 2026-09-24: "i cannot change the lasgun to las-pistol and ccw in the builder... you
   * say in battle - when 'lasgun' appears in a datasheet i substitute it as 'laspistol', and i
   * have a ccw - though being able to change that in the army builder would be nice."
   *
   * The group is only offered to a unit whose own loadout names `replaces`, which is what the
   * word "their" in the trait text means, and it is appended AFTER the datasheet's own groups so
   * no saved list's option indices move (see [[feedback_reordering_choices_breaks_saved_lists]]).
   */
  | { type: 'grant_option_group'; replaces: string; into: string[]; header: string;      applies_to: AppliesTo };

function effectApplies(effect: TraitEffect, unit: Unit): boolean {
  switch (effect.applies_to) {
    case 'all':       return true;
    case 'creature':  return !unit.is_vehicle;
    case 'vehicle':   return unit.is_vehicle;
    case 'character': return unit.is_character;
    case 'infantry':  return !unit.is_vehicle && !unit.is_monster && !unit.is_character;
    case 'monster':   return unit.is_monster;
    case 'psyker':    return unit.is_psyker;
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
 * Is this trait usable ONLY by Psykers? True when it has effects defined and every one of them is
 * psyker-scoped ("Only for Psykers." in the codex) - the Eldar "Children of Prophecy" and the
 * Space Marine "Knowledge is Power".
 *
 * The Trait Picker uses it to stop offering such a trait to a unit that can never manifest a
 * power. It used to hide ONE of them, by name, so the other was selectable and chargeable and did
 * nothing. A trait with no entry here at all returns false and keeps showing: plenty are not wired
 * yet, and hiding those would empty the picker.
 */
export function isPsykerOnlyTrait(traitName: string): boolean {
  const effects = TRAIT_EFFECTS[traitName];
  return !!effects?.length && effects.every(e => e.applies_to === 'psyker');
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
