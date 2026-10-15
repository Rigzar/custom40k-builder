/**
 * "All remaining models may swap their Bolt shotguns" (Hernkyn Yaegirs, Hearthkyn Warriors).
 *
 * The datasheet gives ONE swap that applies to EVERY model the other swaps did not already touch, at a price
 * per model. The group is a single yes/no checkbox, but its quantity is not 1: it is the squad size minus the
 * models that swapped the same weapon through another group. Read as a plain "one", ticking the box changed one
 * Yaegir and charged for one (Unwise: "the box I checked should make all guys with shotguns have it replaced
 * with bolt revolver and plasma knife, not just one guy").
 *
 * The expansion happens once, on a copy of the roster entry, at the two doors every consumer goes through
 * (computeUnitPoints and resolveUnitProfile), so the price, the weapon rows and their counts cannot disagree.
 * The stored selection stays 0/1, and so do the checkbox and every saved list.
 */
import type { Unit } from '../types/data';
import type { RosterEntry } from '../types/army';

/** A one-constraint swap whose own header says it is for "all remaining models". */
export function isAllRemainingSwap(g: Unit['option_groups'][number]): boolean {
  return g.constraint?.type === 'one' && (g.replaces?.length ?? 0) > 0 && g.choices.length === 1
    && /\ball\b[^.]*\bremaining\b/i.test(g.header ?? '');
}

/** The entry with every ticked "all remaining" swap expanded to the number of models it covers. */
export function expandAllRemaining(item: RosterEntry, unit: Unit): RosterEntry {
  const groups = unit.option_groups;
  if (!groups.some(isAllRemainingSwap)) return item;
  let out: RosterEntry | null = null;
  groups.forEach((g, gi) => {
    if (!isAllRemainingSwap(g)) return;
    const ticked = Number(item.optionQty?.[gi]?.[0] ?? 0) > 0;
    if (!ticked) return;
    let others = 0;
    groups.forEach((o, oi) => {
      if (oi === gi || !(o.replaces ?? []).some(n => (g.replaces ?? []).includes(n))) return;
      for (const [ci, q] of Object.entries(item.optionQty?.[oi] ?? {})) if (ci !== '__inline') others += Number(q) || 0;
    });
    const covered = Math.max(0, (item.size ?? 1) - others);
    if (covered <= 1) return;
    out = out ?? { ...item, optionQty: { ...(item.optionQty ?? {}) } };
    out.optionQty = { ...out.optionQty, [gi]: { ...(out.optionQty[gi] ?? {}), 0: covered } };
  });
  return out ?? item;
}
