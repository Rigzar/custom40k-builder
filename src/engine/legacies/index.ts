import type { StructuredNote } from '../archetypes/base';
import type { Power } from '../../types/data';
import { CSM_LEGACY_NOTES } from '../codex_csm/legacies';
import { getGKLegacyPower } from './grey_knights';

const FACTION_LEGACY_NOTES: Record<string, Record<string, StructuredNote[]>> = {
  chaos_space_marines: CSM_LEGACY_NOTES,
};

export function getLegacyStructuredNotes(
  faction: string,
  legacyName: string,
): StructuredNote[] | undefined {
  return FACTION_LEGACY_NOTES[faction]?.[legacyName];
}

/**
 * Returns the always-known power granted to all psykers by the active legacy.
 * Currently only Grey Knights have this mechanic (mirrors how Smite is always-known).
 * Returns null for all other factions or when no legacy is active.
 */
export function getLegacyExtraPower(
  faction: string,
  legacyName: string,
): { name: string; details: Power } | null {
  if (faction === 'Grey Knights') return getGKLegacyPower(legacyName);
  return null;
}
