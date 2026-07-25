/**
 * dataOverrides.ts — admin-authored corrections applied on top of the bundled faction data.
 *
 * Faction data ships compiled inside the JS bundle, so a wrong point cost or stat normally needs a
 * code change + redeploy. The Source-check tab compares the bundle against the creator's live
 * sheet; when a difference is real, an admin can apply the sheet's value from that same screen.
 * Those corrections are stored in `app_settings.data_overrides` and applied here, at load time, so
 * every player sees them immediately.
 *
 * Deliberately narrow: an override can only change a value that already exists (a model's points,
 * one stat, one field of one weapon). It can never add or remove units, weapons or options — that
 * still requires a real data change, reviewed against the .ods. Anything that doesn't match an
 * existing target is skipped silently, so a stale override can't corrupt a faction.
 */
import type { FactionData, Unit, Model, Weapon } from '../types/data';

export interface DataOverride {
  /** Unit name as it appears in the faction's units map. */
  unit: string;
  kind: 'points' | 'stat' | 'weapon';
  /** Model name (points/stat) or weapon name (weapon). */
  target: string;
  /** 'points', a stat key ('M', 'T', 'FRONT'…), or a weapon field ('range', 'type', 's', 'ap', 'd', 'abilities'). */
  field: string;
  /** The corrected value, as text (numbers are parsed for `points`). */
  value: string;
  /** Audit trail — who applied it and when (ISO). */
  by?: string;
  at?: string;
}

/** factionKey → overrides. */
export type DataOverrides = Record<string, DataOverride[]>;

/** Weapon fields an override is allowed to touch. */
const WEAPON_FIELDS = new Set(['range', 'type', 's', 'ap', 'd', 'abilities']);

/** Stable identity of an override, so the UI can tell "already applied" from "new". */
export function overrideKey(o: Pick<DataOverride, 'unit' | 'kind' | 'target' | 'field'>): string {
  return `${o.unit}|${o.kind}|${o.target}|${o.field}`;
}

/**
 * Apply a faction's overrides in place. Returns how many actually matched something — callers can
 * log it; a count lower than the list length just means some overrides are stale.
 */
export function applyDataOverrides(data: FactionData, overrides: DataOverride[] | undefined): number {
  if (!overrides?.length) return 0;
  const units = data.units as Record<string, Unit>;
  let applied = 0;

  for (const o of overrides) {
    const unit = units?.[o.unit];
    if (!unit) continue;

    if (o.kind === 'weapon') {
      if (!WEAPON_FIELDS.has(o.field)) continue;
      const w = (unit.weapons ?? []).find((x: Weapon) => x.name === o.target);
      if (!w) continue;
      (w as unknown as Record<string, string>)[o.field] = o.value;
      applied++;
      continue;
    }

    // points / stat both address a model, which may be a base model or a promoted variant.
    const model = [...(unit.models ?? []), ...(unit.variant_models ?? [])]
      .find((m: Model) => m.name === o.target);
    if (!model) continue;

    if (o.kind === 'points') {
      const n = Number(o.value);
      if (!Number.isFinite(n)) continue;
      model.points = n;
      // min_cost drives the slot-picker price tag; keep it consistent when the cheapest model moved.
      const cheapest = Math.min(...(unit.models ?? []).map((m: Model) => m.points ?? Infinity));
      if (Number.isFinite(cheapest)) unit.min_cost = cheapest;
      applied++;
      continue;
    }

    if (o.kind === 'stat') {
      if (!model.stats || !(o.field in model.stats)) continue;   // never invent a stat the model lacks
      (model.stats as Record<string, string>)[o.field] = o.value;
      applied++;
    }
  }
  return applied;
}
