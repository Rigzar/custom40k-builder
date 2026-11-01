import type { Archetype, Trait } from '../types/data';

/**
 * The Horus Heresy books tie an archetype to a Legacy when its own text says "Can only be selected with the Legacy of the Lion."
 * (Legion traits used to be tied too; they are open to every Legion now.) It is read from the data, not listed by hand, so a rename on the sheet needs no code change.
 */

/** The Legacy an archetype demands, or null when its text names none. */
export function archetypeRequiredLegacy(archetype: Pick<Archetype, 'desc'> | undefined): string | null {
  const m = String(archetype?.desc ?? '').match(/Can only be selected with the (Legacy of [^.\n]+?)\./);
  return m ? m[1].trim() : null;
}

/**
 * May this Legion trait be taken with the army's Legacy (or Legacies)?
 * Rigzar 2026-11-01: the traits are open to every Legion again (two per army, from the whole list).
 * The Legacy no longer gates them. The function stays as the one place to tell the Blackshields and the
 * Legacy of the Sundered apart when those two are reworked.
 */
export function legionTraitAllowed(
  _trait: Pick<Trait, 'legion'>,
  _legacies: Array<{ armory_key?: string | null } | undefined>,
): boolean {
  return true;
}

/** The Legacy a datasheet demands ("Can only be selected if the army has the Legacy of X."), or null. */
export function unitRequiredLegacy(unit: { requires_legacy?: string; option_groups?: Array<{ header?: string }> } | undefined | null): string | null {
  if (unit?.requires_legacy) return unit.requires_legacy;
  for (const g of unit?.option_groups ?? []) {
    const m = String(g.header ?? '').match(/Can only be selected if the army has the (Legacy of [^.\n]+?)\./);
    if (m) return m[1].trim();
  }
  return null;
}

/**
 * May the army take a datasheet that needs the archetype `needArch`? Yes with that archetype, and also with the Legion Specialists
 * archetype when the army has the Legacy of the Legion that archetype belongs to (its special units are open to the Specialists of that Legacy).
 */
export function archetypeOpensUnit(
  needArch: string,
  archetype: string | null | undefined,
  legacy: string | null | undefined,
  archetypes: Array<Pick<Archetype, 'name' | 'desc'>>,
): boolean {
  if (needArch === archetype) return true;
  if (archetype !== 'Legion Specialists') return false;
  const legacyOfNeed = archetypeRequiredLegacy(archetypes.find(a => a.name === needArch));
  return !!legacyOfNeed && legacyOfNeed === legacy;
}

/** The archetype a datasheet demands (`requires_archetype`), or null. */
export function unitRequiredArchetype(unit: { requires_archetype?: string } | undefined | null): string | null {
  return unit?.requires_archetype ?? null;
}
