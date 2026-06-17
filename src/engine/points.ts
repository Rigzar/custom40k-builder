import type { Unit, Model, FactionData } from '../types/data';
import type { RosterEntry } from '../types/army';
import { computeVehicleCombiSurcharge } from './codex_csm/archetypes/weapon-overrides';

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

type ActiveVariant = { variant: Model; group: { header: string; inline_pts: number | null } };

function getActiveVariant(item: RosterEntry, unit: Unit): ActiveVariant | null {
  for (const [gi, g] of unit.option_groups.entries()) {
    if (!g.variant_link) continue;
    const qty = item.optionQty?.[gi];
    if (qty?.['__inline']) {
      const variant = unit.variant_models.find(v => v.name === g.variant_link) ?? null;
      if (!variant) return null;
      return { variant, group: g };
    }
  }
  return null;
}

/** The base model group a variant promotes from — derived from the option group's own
 * wording ("One Traitor Guardsman may be promoted to…") rather than array position, since
 * the promoted group isn't always last in `unit.models` (e.g. Traitor Guard's Ogryn group). */
function getPromotedModel(unit: Unit, active: ActiveVariant): Model {
  const { variant, group } = active;
  // Prefer the most specific (longest name) match — e.g. "Grey Hunter Pack Leader" over
  // "Grey Hunter" when both are substrings of the option-group header.
  const nameMatches = unit.models.filter(m => group.header.includes(m.name));
  if (nameMatches.length > 0) {
    return nameMatches.reduce((a, b) => (b.name.length > a.name.length ? b : a));
  }
  return unit.models.find(m => m.points === variant.points - (group.inline_pts ?? 0))
    ?? unit.models.find(m => m.max > m.min && m.min === 0)
    ?? unit.models[0];
}

export function computeUnitPoints(item: RosterEntry, unit: Unit, archetype = ''): number {
  let total = 0;
  const active = getActiveVariant(item, unit);

  if (active) {
    const { variant } = active;
    const fixedBase = unit.models.reduce((s, m) => s + m.min, 0);
    if (fixedBase === 1 && item.size === 1) {
      total = variant.points;
    } else if (item.modelSizes) {
      // Multi-group unit: bill each group at its own price; the promoted model comes
      // out of its base group's count (one fewer at base price, plus the variant's price).
      const promoted = getPromotedModel(unit, active);
      for (const m of unit.models) {
        const count = item.modelSizes[m.name] ?? m.min;
        if (m === promoted) {
          total += Math.max(0, count - 1) * m.points + variant.points;
        } else {
          total += count * m.points;
        }
      }
    } else {
      const grunt = unit.models.find(m => m.max > m.min && m.min === 0) ?? unit.models[0];
      total += variant.points;
      const extra = Math.max(0, item.size - 1);
      total += extra * grunt.points;
    }
  } else if (item.modelSizes) {
    // Multi-group unit: each group billed at its own per-model price.
    for (const m of unit.models) {
      const count = item.modelSizes[m.name] ?? m.min;
      total += count * m.points;
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
        // Per-model inline upgrades ("…for +X points per model") scale with unit size; flat
        // one-off inline options (promote one Sergeant, etc.) are charged once. (per_model flag)
        if (qty && g.inline_pts) total += g.inline_pts * (g.per_model ? item.size : 1);
        continue;
      }
      const choice = g.choices[parseInt(ci)];
      if (choice) total += choice.points * qty * (g.per_model ? item.size : 1);
    }
  }

  for (const it of item.armory ?? []) total += it.points ?? 0;
  // army.ts already filters which units receive traits (CSM keyword check, faction check, etc.)
  // so item.traits is always the correct pre-filtered list — just sum it here.
  for (const t of item.traits ?? []) {
    if (t.perWound) {
      const wStatKey = unit.is_vehicle ? 'HP' : 'W';
      const wStat = unit.models[0]?.stats[wStatKey];
      const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
      total += t.points * woundsPerModel * item.size;
    } else {
      total += t.points;
    }
  }

  total += computeVehicleCombiSurcharge(item, unit, archetype);

  return total;
}

export { getActiveVariant, getPromotedModel };
export type { ActiveVariant };
