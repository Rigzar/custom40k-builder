import type { Unit } from '../types/data';
import type { RosterEntry } from '../types/army';

/**
 * Returns true if the option group at index `gi` should be shown and counted.
 * An OG with show_if is hidden unless its condition is met.
 */
export function isOGVisible(unit: Unit, gi: number, item: RosterEntry): boolean {
  const g = unit.option_groups[gi];
  if (!g?.show_if) return true;

  const { og_idx, condition } = g.show_if;
  const ref = unit.option_groups[og_idx];
  if (!ref) return true;

  const qty = item.optionQty?.[og_idx];
  const refHasSelection =
    // any choice selected with qty > 0
    ref.choices.some((_, ci) => (qty?.[ci] ?? 0) > 0) ||
    // or inline toggle active
    (qty?.['__inline'] ?? 0) > 0;

  return condition === 'empty' ? !refHasSelection : refHasSelection;
}
