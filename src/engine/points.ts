import type { Unit, Model, FactionData } from '../types/data';
import type { RosterEntry } from '../types/army';
import { computeVehicleCombiSurcharge } from './weapons/csm';

/** Resolve a unit from the correct faction source. */
export function resolveUnit(item: { unitName: string; factionSource?: string }, data: FactionData): Unit | undefined {
  if (item.factionSource) {
    return data.allied?.[item.factionSource]?.units[item.unitName];
  }
  return data.units[item.unitName];
}

function isMarkGroup(g: { constraint: { type: string } }) {
  return g.constraint.type === 'mark';
}

function getActiveVariant(item: RosterEntry, unit: Unit): Model | null {
  for (const [gi, g] of unit.option_groups.entries()) {
    if (!g.variant_link) continue;
    const qty = item.optionQty?.[gi];
    if (qty?.['__inline']) {
      return unit.variant_models.find(v => v.name === g.variant_link) ?? null;
    }
  }
  return null;
}

export function computeUnitPoints(item: RosterEntry, unit: Unit, archetype = ''): number {
  let total = 0;
  const variant = getActiveVariant(item, unit);

  if (variant) {
    const fixedBase = unit.models.reduce((s, m) => s + m.min, 0);
    if (fixedBase === 1 && item.size === 1) {
      total = variant.points;
    } else {
      const grunt = unit.models.find(m => m.max > m.min && m.min === 0) ?? unit.models[0];
      total += variant.points;
      const extra = Math.max(0, item.size - 1);
      total += extra * grunt.points;
    }
  } else {
    const fixed = unit.models.reduce((s, m) => s + m.min, 0);
    const variable = unit.models.find(m => m.max > m.min && m.min === 0) ?? unit.models[0];
    for (const m of unit.models) total += m.min * m.points;
    const extra = Math.max(0, item.size - fixed);
    total += extra * (variable?.points ?? 0);
  }

  if (item.blackCrusadeHQ) {
    // Black Crusade champion pays the combined cost of all four god marks
    const mg = unit.option_groups.find(isMarkGroup);
    if (mg) {
      const CHAOS_MARKS_ALL = ['Khorne', 'Nurgle', 'Slaanesh', 'Tzeentch'];
      for (const markName of CHAOS_MARKS_ALL) {
        const c = mg.choices.find(ch => ch.name === markName);
        if (c) total += c.points * item.size;
      }
    }
  } else {
    const effMark = unit.locked_mark ?? item.mark;
    if (effMark) {
      const mg = unit.option_groups.find(isMarkGroup);
      if (mg) {
        const c = mg.choices.find(c => c.name === effMark);
        if (c) total += c.points * item.size;
      }
    }
  }

  for (const [gi, ch] of Object.entries(item.optionQty ?? {})) {
    const g = unit.option_groups[Number(gi)];
    if (!g || isMarkGroup(g)) continue;
    if (g.variant_link) continue;
    for (const [ci, qty] of Object.entries(ch)) {
      if (ci === '__inline') {
        if (qty && g.inline_pts) total += g.inline_pts;
        continue;
      }
      const choice = g.choices[parseInt(ci)];
      if (choice) total += choice.points * qty;
    }
  }

  for (const it of item.armory ?? []) total += it.points ?? 0;
  // CSM army traits only apply to "Chaos Space Marine" keyword units.
  // Subfaction units (World Eaters, Death Guard, Thousand Sons, Emperor's Children) pay no trait cost.
  const hasCSMKeyword = unit.keywords?.includes('Chaos Space Marine') ?? false;
  const traitsApply = !unit.keywords || hasCSMKeyword;
  if (traitsApply) {
    for (const t of item.traits ?? []) {
      if (t.perWound) {
        const wStatKey = unit.is_vehicle ? 'HP' : 'W';
        const wStat = unit.models[0]?.stats[wStatKey];
        const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
        total += t.points * woundsPerModel * item.size;
      } else {
        // Flat cost per unit (not per model). Only starred traits multiply by wounds × size.
        total += t.points;
      }
    }
  }

  total += computeVehicleCombiSurcharge(item, unit, archetype);

  return total;
}

export { getActiveVariant };
