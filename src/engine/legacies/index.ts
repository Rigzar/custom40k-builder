import type { StructuredNote } from '../archetypes/base';
import { CSM_LEGACY_NOTES } from './csm-legacies';

const FACTION_LEGACY_NOTES: Record<string, Record<string, StructuredNote[]>> = {
  chaos_space_marines: CSM_LEGACY_NOTES,
};

export function getLegacyStructuredNotes(
  faction: string,
  legacyName: string,
): StructuredNote[] | undefined {
  return FACTION_LEGACY_NOTES[faction]?.[legacyName];
}
