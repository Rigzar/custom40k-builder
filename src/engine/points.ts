import type { Unit, Model, FactionData } from '../types/data';
import type { RosterEntry } from '../types/army';
import { computeVehicleCombiSurcharge } from './codex_csm/archetypes/weapon-overrides';
import { getArchetypeRule } from './archetypes';

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
      const effectiveSize = Math.max(item.size, grunt.min);
      const extra = Math.max(0, effectiveSize - 1);
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
    // A mark forced by the army's archetype (e.g. Plaguehost → Mark of Nurgle) still costs
    // points even when the player never explicitly picked it on this unit (item.mark stays
    // null) — mirrors resolver.ts's effectiveMark, which already grants the forced mark's
    // keyword/abilities for free. Without this, forced-mark armies silently undercharge
    // every unit that didn't get an explicit per-unit mark selection.
    const rule = getArchetypeRule(archetype);
    const effMark = unit.locked_mark ?? (rule?.forcedMark as string | null) ?? item.mark ?? null;
    if (effMark) {
      const mg = unit.option_groups.find(isMarkGroup);
      if (mg) {
        const c = mg.choices.find(c => c.name === effMark);
        if (c) total += c.points * item.size;
      } else if (rule?.grantsMarkPurchase) {
        // Traitor Guard (IG units have no native mark group of their own) — ods-verbatim
        // "point cost per model and per Wound": Khorne/Slaanesh +1, Nurgle/Tzeentch +2,
        // vehicles flat +10 regardless of which mark.
        if (unit.is_vehicle) {
          total += 10 * item.size;
        } else {
          const wStat = unit.models[0]?.stats.W;
          const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
          const rate = (effMark === 'Nurgle' || effMark === 'Tzeentch') ? 2 : 1;
          total += rate * woundsPerModel * item.size;
        }
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

  // Archetype-forced mandatory ability, no opt-out (Brood Brothers' Ambush, Gue'vesa's
  // Supporting Fire — both ods-verbatim "All [creature] units must gain... for X pt/Wound [or
  // Y pt/Hull point]"). Main-faction units only — allied/injected units don't pay it.
  if (!item.factionSource) {
    const rule = getArchetypeRule(archetype);
    const fa = rule?.forcedAbility;
    if (fa && !(fa.creatureOnly && unit.is_vehicle)) {
      const wStatKey = unit.is_vehicle ? 'HP' : 'W';
      const wStat = unit.models[0]?.stats[wStatKey];
      const woundsPerModel = parseInt(wStat ?? '1', 10) || 1;
      const rate = unit.is_vehicle ? (fa.pointsPerHull ?? fa.pointsPerWound) : fa.pointsPerWound;
      total += rate * woundsPerModel * item.size;
    }
  }

  // Gue'vesa: optional per-model Lasgun/Hot-shot lasgun → Pulse rifle swap (ods-verbatim
  // "+3 points"/"+2 points" — per model swapping, not a flat unit-wide cost).
  total += (item.gueVesaLasgunSwaps ?? 0) * 3 + (item.gueVesaHotshotSwaps ?? 0) * 2;

  // Yngir: "One C'tan shard (any kind) counts as an HQ selection... It costs an additional
  // +85 points" (ods-verbatim, Necrons Army Customisation). Flat surcharge, not per-model —
  // C'tan Shards are always a single model (default_size 1).
  if (item.ctanYngirUpgrade) total += 85;

  return total;
}

export { getActiveVariant, getPromotedModel };
export type { ActiveVariant };
