import type { FactionData } from '../types/data';

/**
 * Custom40k Missions (Skirmish), the Army Building Basics:
 *   "Only Archetypes that are available in Skirmish may be selected."
 * Which ones are is written in each codex, in the "AVAILABLE IN SKIRMISH?" column of its Army Customisation tab
 * (YES or "-"). The flag lives on the archetype in `data/parsed/<faction>/archetypes.json` as `skirmish: true`.
 *
 * Not set means NOT available: the sheet says "-", and an archetype nobody has reviewed for Skirmish is not allowed
 * until the author says so.
 */
export function archetypeAllowedInSkirmish(data: Pick<FactionData, 'archetypes'> | null | undefined, name: string | null | undefined): boolean {
  if (!name) return true; // no archetype selected: nothing to refuse
  return !!data?.archetypes.find(a => a.name === name)?.skirmish;
}

/**
 * Custom40k Missions (Skirmish), Allies:
 *   "Allies do not use their own Army Organisation Plan. Instead, all selections are part of the army's regular AOP.
 *    Must include 1 Troops unit. May include up to one of the following: 1 Elite unit. 1 Fast Attack unit. 1 Heavy Support unit."
 * So an allied detachment in Skirmish is exactly one Troops unit plus at most ONE unit from Elites / Fast Attack /
 * Heavy Support combined, and nothing else (no HQ, no transport, no second Troops).
 */
export const SKIRMISH_ALLY_TROOPS = 1;
export const SKIRMISH_ALLY_EXTRA_SLOTS: readonly string[] = ['Elites', 'Fast Attack', 'Heavy Support'];
export const SKIRMISH_ALLY_EXTRA_MAX = 1;
