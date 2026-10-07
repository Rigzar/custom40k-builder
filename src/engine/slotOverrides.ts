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

/**
 * A variant upgrade the datasheet says makes the unit an HQ selection, keyed by the slot it leaves.
 *
 *   Ascended Daemon Prince (Chaos Daemons) -- "The unit uses a HQ slot instead of Heavy Support".
 *   Chief Apothecary / Master of the Forge (Space Marines) -- "he counts as a HQ selection and fills up
 *   a slot". Both read the Elites slot and the free Advisor exemption until 2026-10-07, so the
 *   Techmarine upgraded to Master of the Forge neither filled an HQ slot nor counted as one (GH#210);
 *   the Chief Apothecary had the identical fault and nobody had reported it yet.
 */
const HQ_VARIANTS: { from: string; variant: string }[] = [
  { from: 'Heavy Support', variant: 'Ascended Daemon Prince' },
  { from: 'Elites', variant: 'Master of the Forge' },
  { from: 'Elites', variant: 'Chief Apothecary' },
];

/**
 * True when the entry has bought the Ascended Daemon Prince upgrade: the datasheet says the model "has all
 * Marks of Chaos (already included in the profile)". Choosing a Mark on top charged it a second time and
 * stacked the Mark's bonuses on a profile that already has them, and the "if no Mark of Khorne is taken"
 * psyker upgrade cannot apply to a model that has Khorne.
 */
export function hasAllMarksVariant(item: RosterEntry, unit: Unit | undefined): boolean {
  if (!unit) return false;
  const gi = unit.option_groups.findIndex(g => g.variant_link === 'Ascended Daemon Prince');
  return gi >= 0 && (item.optionQty?.[gi]?.['__inline'] ?? 0) > 0;
}

/**
 * The Ascended Daemon Prince's own rule: "replaces the Daemon ability with Greater Daemon, loses Daemonic
 * instability, gains Fearless and Terrifying(-2)". The datasheet's keyword line is static, so apply that
 * sentence to it when the upgrade is bought; every other line is returned untouched.
 */
export function ascendedKeywordLine(line: string): string {
  const parts = line.split(',').map(s => s.trim());
  if (!parts.some(p => /^daemon$/i.test(p)) || !parts.some(p => /^daemonic instability$/i.test(p))) return line;
  const out = parts
    .filter(p => !/^daemonic instability$/i.test(p))
    .map(p => (/^daemon$/i.test(p) ? 'Greater Daemon' : /^terrifying\(-1\)$/i.test(p) ? 'Terrifying(-2)' : p));
  if (!out.some(p => /^fearless$/i.test(p))) out.push('Fearless');
  return out.join(', ');
}

/** True when this entry's active variant upgrade makes it an HQ selection (it is then no Advisor). */
export function variantIsHq(item: RosterEntry, unit: Unit | undefined, baseSlot: string): boolean {
  if (!unit) return false;
  return HQ_VARIANTS.some(r => {
    if (r.from !== baseSlot) return false;
    const gi = unit.option_groups.findIndex(g => g.variant_link === r.variant);
    return gi >= 0 && (item.optionQty?.[gi]?.['__inline'] ?? 0) > 0;
  });
}

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
 *   Ascended Daemon Prince, Master of the Forge, Chief Apothecary — to HQ when the variant upgrade is active.
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

  if (variantIsHq(item, unit, baseSlot)) return 'HQ';
  if (baseSlot === 'Heavy Support') return baseSlot;

  for (const rule of SLOT_OPT_INS) {
    if (rule.from !== baseSlot) continue;
    const gi = unit.option_groups.findIndex(g => rule.test.test(g.header));
    if (gi >= 0 && (item.optionQty?.[gi]?.['__inline'] ?? 0) > 0) return rule.to;
  }

  return baseSlot;
}
