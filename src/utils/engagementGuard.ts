import type { EngagementType } from '../types/army';
import { useArmyStore } from '../store/army';
import { archetypeAllowedInSkirmish } from '../engine/skirmishRules';

/**
 * Gate for changing the engagement type.
 *
 * Missions (Skirmish): "Only Archetypes that are available in Skirmish may be selected." Allies ARE allowed there now
 * (Missions, Allies), so the only thing a switch into Skirmish can take away is an archetype the codex does not mark
 * "available in Skirmish" -- on the primary army or on the ally. It used to be an Allied Detachment that vanished
 * silently and could not be undone (user report 2026-08-09); the same care applies to an archetype: say so first, and
 * only drop it when the player agrees.
 *
 * Every engagement picker must go through this. Returns false when the player declines, in which case the caller must
 * not call `setEngagement`. On a yes it has already cleared the archetype(s), so the caller just sets the engagement.
 */
export function allowEngagementChange(next: EngagementType, confirmMessage: string): boolean {
  if (next !== 'skirmish') return true;
  const s = useArmyStore.getState();
  const primaryBlocked = !!s.archetype && !archetypeAllowedInSkirmish(s.data, s.archetype);
  const alliedBlocked = !!s.alliedArchetype && !archetypeAllowedInSkirmish(s.alliedData, s.alliedArchetype);
  if (!primaryBlocked && !alliedBlocked) return true;
  if (!confirm(confirmMessage)) return false;
  if (primaryBlocked) s.setArchetype('');
  if (alliedBlocked) s.setAlliedArchetype('');
  return true;
}
