import type { FactionData, Power } from '../types/data';

/**
 * Shared formatting + lookup for prayers, infernal pacts and psychic powers.
 *
 * WHY THIS EXISTS: a roster entry stores prayers/pacts/powers as bare NAME STRINGS
 * (`RosterEntry.prayers: string[]`), while every rules detail — range, target, effect, duration —
 * lives in the faction's psychic data. Three separate render sites (PsychicModal, UnitCard,
 * PrintView) each re-derived their own partial version of this, and all three dropped fields:
 * the selection modal showed name + effect only, and the unit card and Print View showed nothing
 * but the name. Selecting "Veil of Despair" and never being told anywhere in the app that it is a
 * 6" radius effect was the reported bug (v1.70).
 *
 * Everything renders through here now, so the three views cannot drift apart again.
 */

/** Look a prayer / pact / psychic power up by name across the whole faction's psychic data. */
export function findPowerByName(name: string, data: FactionData | null | undefined): Power | undefined {
  if (!data) return undefined;
  const pools: Power[][] = [
    data.prayers ?? [],
    data.pacts ?? [],
    ...Object.values(data.disciplines ?? {}),
  ];
  for (const pool of pools) {
    const hit = pool.find(p => p.name === name);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * The compact metadata line: "Augmentation · 12" · Cast 5 · Friendly unit · Until next activation".
 * Fields absent from the source are simply skipped, and a range of "-" (self-only, the majority of
 * prayers) is omitted rather than printed as a dash.
 */
export function powerMetaLine(p: Power | undefined): string {
  if (!p) return '';
  return [
    p.type,
    p.range && p.range !== '-' ? p.range : null,
    p.cast_value ? `Cast ${p.cast_value}` : null,
    p.target,
    p.duration,
  ].filter(Boolean).join(' · ');
}

/** Metadata line for a name, resolving it against the faction data first. */
export function powerMetaByName(name: string, data: FactionData | null | undefined): string {
  return powerMetaLine(findPowerByName(name, data));
}

/** The rules text for a name, or '' when the entry cannot be resolved. */
export function powerEffectByName(name: string, data: FactionData | null | undefined): string {
  return findPowerByName(name, data)?.effect ?? '';
}
