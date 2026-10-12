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
 * one stat, one field of one weapon, one upgrade's cost). It can never add or remove units,
 * weapons or options — that
 * still requires a real data change, reviewed against the .ods. Anything that doesn't match an
 * existing target is skipped silently, so a stale override can't corrupt a faction.
 */
import type { FactionData, Unit, Model, Weapon } from '../types/data';

export interface DataOverride {
  /** Unit name as it appears in the faction's units map. */
  unit: string;
  kind: 'points' | 'stat' | 'weapon' | 'option';
  /** Model name (points/stat), weapon name (weapon), or choice name (option). */
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

/** Ability lists differ by ORDER between the sheet and an old override without meaning anything. */
const norm = (field: string, v: unknown): string => {
  const t = String(v ?? '').replace(/\s+/g, ' ').trim();
  return field === 'abilities' ? t.split(',').map(x => x.trim().toLowerCase()).filter(Boolean).sort().join(',') : t;
};

/**
 * What an override is up against NOW: the value the bundled data holds for its target.
 * `gone` = the target no longer exists (a renamed or removed model/weapon/option); `differs` = it
 * exists and holds something else. An override that no longer agrees with the data is almost always
 * stale: it recorded the sheet's value on the day it was applied, and the sheet (and so the file the
 * unit update writes) has moved on since, so it now HIDES the update. Found 2026-10-07 when a
 * Biovore updated to 41 points kept showing 110 (an override from 21 September).
 */
export function checkOverride(data: FactionData, o: DataOverride): { status: 'same' | 'differs' | 'gone'; current: string } {
  const unit = (data.units as Record<string, Unit>)?.[o.unit];
  if (!unit) return { status: 'gone', current: '' };
  let found: boolean;
  let current: unknown;
  if (o.kind === 'option') {
    const cs = (unit.option_groups ?? []).flatMap(g => g.choices ?? []).filter(c => c.name === o.target);
    found = cs.length === 1; current = cs[0]?.points;
  } else if (o.kind === 'weapon') {
    const w = (unit.weapons ?? []).find((x: Weapon) => x.name === o.target);
    found = !!w; current = (w as unknown as Record<string, string> | undefined)?.[o.field];
  } else {
    const m = [...(unit.models ?? []), ...(unit.variant_models ?? [])].find((x: Model) => x.name === o.target);
    found = !!m; current = o.kind === 'points' ? m?.points : (m?.stats as Record<string, string> | undefined)?.[o.field];
  }
  if (!found) return { status: 'gone', current: '' };
  const cur = String(current ?? '');
  return { status: norm(o.field, cur) === norm(o.field, o.value) ? 'same' : 'differs', current: cur };
}

/**
 * Apply a faction's overrides in place. Returns how many actually matched something — callers can
 * log it; a count lower than the list length just means some overrides are stale.
 */
/**
 * What the unit-update script writes from the sheets: a model's points and stats, and a weapon's
 * profile. Upgrade costs (`option`) are NOT in that list: the script leaves the options section to
 * hand editing, so an option override can still be the only thing carrying a correction.
 */
const SHEET_OWNED_KINDS = new Set(['points', 'stat', 'weapon']);

/**
 * `sheetOwned` is true for a faction whose unit files the update script regenerates from the sheets
 * (the 19 in factions.csv; not the Horus Heresy, Legio Titanicus or Escalation supplements). For
 * those, an override of a sheet-owned kind can only repeat what the file says or contradict it, and
 * a contradiction is a correction made against an OLDER sheet: it hid the update. Biovore: the file
 * said 41 after the update and an override from 21 September kept every player at 110, and the same
 * list held 26 more that disagreed with the data. The file, which IS the sheet, now wins.
 */
export function applyDataOverrides(data: FactionData, overrides: DataOverride[] | undefined, sheetOwned = false): number {
  if (!overrides?.length) return 0;
  const units = data.units as Record<string, Unit>;
  let applied = 0;

  for (const o of overrides) {
    const unit = units?.[o.unit];
    if (!unit) continue;
    if (sheetOwned && SHEET_OWNED_KINDS.has(o.kind)) continue;

    if (o.kind === 'option') {
      // An upgrade's cost. Only ever applied when exactly ONE choice in the whole unit carries
      // that name: two same-named choices give no way to tell which the admin meant, and silently
      // picking one is how the wrong row gets edited.
      if (o.field !== 'points') continue;
      const matches = (unit.option_groups ?? [])
        .flatMap(g => g.choices ?? [])
        .filter(c => c.name === o.target);
      const n = Number(o.value);
      if (matches.length !== 1 || !Number.isFinite(n)) continue;
      matches[0].points = n;
      applied++;
      continue;
    }

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
