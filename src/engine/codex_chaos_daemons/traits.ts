import type { TraitEffect } from '../traitEffects';

/**
 * Chaos Daemons trait effects.
 *
 * SOURCE: Chaos Daemons — Army Customisation sheet (canonical)
 * ─────────────────────────────────────────────────────────────
 * "You may select up to the following: 0-1 Archetype."
 * Chaos Daemons have NO Legacies and NO Traits — only Archetypes.
 * This file is intentionally empty. If traits are ever added to CD in a
 * future supplement, add entries here following the same format as
 * engine/traits/csm.ts: 'Trait Name': [ { type, applies_to, ... }, ... ]
 */
export const CD_TRAIT_EFFECTS: Record<string, TraitEffect[]> = {
  // No traits defined for Chaos Daemons
};
