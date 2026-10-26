import type { Archetype, Trait } from '../types/data';

/**
 * The Horus Heresy books tie two kinds of choice to a Legacy:
 *  - an archetype whose own text says "Can only be selected with the Legacy of the Lion."
 *  - a Legion trait, which belongs to the Legion the Legacy names (`Legion: Dark Angels (Loyalist).`).
 * Both are read from the data, not listed by hand, so a rename on the sheet needs no code change.
 */

/** The Legacy an archetype demands, or null when its text names none. */
export function archetypeRequiredLegacy(archetype: Pick<Archetype, 'desc'> | undefined): string | null {
  const m = String(archetype?.desc ?? '').match(/Can only be selected with the (Legacy of [^.\n]+?)\./);
  return m ? m[1].trim() : null;
}

/**
 * May this Legion trait be taken with the army's Legacy (or Legacies)?
 * A trait with no `legion` tag is open to everyone. A tagged one needs a Legacy that opens that
 * Legion's Armory. A Legacy with no Legion of its own (the Sundered) can take any Legion's traits.
 */
export function legionTraitAllowed(
  trait: Pick<Trait, 'legion'>,
  legacies: Array<{ armory_key?: string | null } | undefined>,
): boolean {
  if (!trait.legion) return true;
  const picked = legacies.filter((l): l is { armory_key?: string | null } => !!l);
  if (!picked.length) return false;
  return picked.some(l => !l.armory_key || l.armory_key === trait.legion);
}

/** The Legacy a datasheet demands ("Can only be selected if the army has the Legacy of X."), or null. */
export function unitRequiredLegacy(unit: { option_groups?: Array<{ header?: string }> } | undefined | null): string | null {
  for (const g of unit?.option_groups ?? []) {
    const m = String(g.header ?? '').match(/Can only be selected if the army has the (Legacy of [^.\n]+?)\./);
    if (m) return m[1].trim();
  }
  return null;
}
