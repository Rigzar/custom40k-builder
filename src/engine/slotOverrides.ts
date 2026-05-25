import type { RosterEntry } from '../types/army';
import type { Unit } from '../types/data';

/**
 * Apply dynamic slot overrides based on active variant upgrades.
 *
 * Currently handles:
 *   Ascended Daemon Prince — Heavy Support → HQ when the variant upgrade is active.
 *
 * @param item  The roster entry (carries optionQty state).
 * @param unit  The unit definition (carries option_groups metadata).
 * @param baseSlot  The slot after static archetype remapping (from getEffectiveSlot).
 * @returns  The final effective slot for this specific roster entry.
 */
export function applyVariantSlotOverride(
  item: RosterEntry,
  unit: Unit | undefined,
  baseSlot: string,
): string {
  if (!unit || baseSlot !== 'Heavy Support') return baseSlot;

  const ascIdx = unit.option_groups.findIndex(
    g => g.variant_link === 'Ascended Daemon Prince',
  );
  if (ascIdx >= 0 && (item.optionQty?.[ascIdx]?.['__inline'] ?? 0) > 0) {
    return 'HQ';
  }

  return baseSlot;
}
