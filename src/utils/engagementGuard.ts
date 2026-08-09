import type { EngagementType } from '../types/army';

/**
 * Gate for changing the engagement type.
 *
 * Missions (Skirmish): "No allies may be included." `setEngagement` in the store enforces that by
 * dropping the allied detachment AND every unit belonging to it — which is the correct rule, but
 * it used to happen silently and could not be undone: switching back to Pitched Battle does not
 * bring the ally back. A player who clicked Skirmish to see what it was lost a whole detachment
 * with nothing on screen saying so (user report 2026-08-09).
 *
 * Every engagement picker must go through this. Returns false when the player declines, in which
 * case the caller must not call `setEngagement`.
 */
export function allowEngagementChange(
  next: EngagementType,
  alliedFaction: string | undefined,
  confirmMessage: string,
): boolean {
  if (next === 'skirmish' && alliedFaction) return confirm(confirmMessage);
  return true;
}
