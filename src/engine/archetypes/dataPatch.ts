import type { FactionData, Unit } from '../../types/data';
import { getArchetypeRule } from './index';

/** Patched unit -> the unit it was made from. Kept per unit, not per data object, because the data object is
 *  rebuilt whenever an allied detachment is merged in; the unit objects themselves survive that. */
const ORIGINAL = new WeakMap<Unit, Unit>();

function patchUnit(u: Unit, p: { dropModels?: string[]; dropAbilityPrefixes?: string[] }): Unit {
  const drop = new Set((p.dropModels ?? []).map(n => n.toLowerCase()));
  const dropped = u.models.filter(m => drop.has(m.name.toLowerCase()));
  const prefixes = (p.dropAbilityPrefixes ?? []).map(x => x.toLowerCase());
  const out: Unit = {
    ...u,
    models: u.models.map(m => drop.has(m.name.toLowerCase()) ? { ...m, min: 0, max: 0 } : m),
    abilities: (u.abilities ?? []).filter(a => !prefixes.some(x => a.toLowerCase().startsWith(x))),
    default_size: Math.max(1, u.default_size - dropped.reduce((a, m) => a + m.min, 0)),
    min_cost: u.min_cost - dropped.reduce((a, m) => a + m.min * m.points, 0),
  };
  ORIGINAL.set(out, u);
  return out;
}

/**
 * The faction data as the given archetype sees it. Some archetypes remove a model or an ability
 * from named units ("may not take Runtherds", "lose Cowardly"); unit data is read without the
 * archetype everywhere, so the removal is done once, on copies of those units, whenever the
 * archetype or the data changes. Returns the very same object when nothing changes.
 */
export function dataForArchetype(data: FactionData, archetype: string): FactionData {
  const patch = getArchetypeRule(archetype)?.unitPatch;
  let units = data.units;
  for (const [n, u] of Object.entries(data.units)) {
    const orig = ORIGINAL.get(u);
    if (orig && !(patch?.units.includes(n))) { if (units === data.units) units = { ...data.units }; units[n] = orig; }
  }
  for (const n of patch?.units ?? []) {
    const u = units[n];
    if (!u || ORIGINAL.has(u)) continue;
    if (units === data.units) units = { ...data.units };
    units[n] = patchUnit(u, patch!);
  }
  return units === data.units ? data : { ...data, units };
}
