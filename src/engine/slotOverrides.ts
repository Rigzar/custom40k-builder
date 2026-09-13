import type { RosterEntry } from '../types/army';
import type { Unit } from '../types/data';

/**
 * An option group whose header opts the unit into a different Army Organisation slot, keyed by the
 * slot it comes FROM. Matched on the header text because these are free toggles with no
 * `variant_link` — there is no promoted model behind them, the unit just occupies a different slot.
 *
 * Canoptek Scarabs (Necrons 1.11): 'For each "Warriors" unit, one "Canoptek Scarabs" unit may be
 * selected as Troops. Can't be a mandatory unit selection.' The one-per-Warriors cap and the
 * "not mandatory" half are enforced in validators.ts — this only moves the slot.
 */
const SLOT_OPT_INS: { from: string; to: string; test: RegExp }[] = [
  { from: 'Fast Attack', to: 'Troops', test: /may be selected as Troops/i },
];

/** True when this entry has opted into a different slot (used to exclude it from AOP minimums). */
export function hasSlotOptIn(item: RosterEntry, unit: Unit | undefined, baseSlot: string): boolean {
  if (!unit) return false;
  return SLOT_OPT_INS.some(rule => {
    if (rule.from !== baseSlot) return false;
    const gi = unit.option_groups.findIndex(g => rule.test.test(g.header));
    return gi >= 0 && (item.optionQty?.[gi]?.['__inline'] ?? 0) > 0;
  });
}

/**
 * Apply dynamic slot overrides based on active variant upgrades or slot opt-ins.
 *
 * Currently handles:
 *   Ascended Daemon Prince — Heavy Support → HQ when the variant upgrade is active.
 *   Canoptek Scarabs       — Fast Attack → Troops when the "may be selected as Troops" box is ticked.
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
  if (!unit) return baseSlot;

  if (baseSlot === 'Heavy Support') {
    const ascIdx = unit.option_groups.findIndex(
      g => g.variant_link === 'Ascended Daemon Prince',
    );
    if (ascIdx >= 0 && (item.optionQty?.[ascIdx]?.['__inline'] ?? 0) > 0) {
      return 'HQ';
    }
    return baseSlot;
  }

  for (const rule of SLOT_OPT_INS) {
    if (rule.from !== baseSlot) continue;
    const gi = unit.option_groups.findIndex(g => rule.test.test(g.header));
    if (gi >= 0 && (item.optionQty?.[gi]?.['__inline'] ?? 0) > 0) return rule.to;
  }

  return baseSlot;
}
