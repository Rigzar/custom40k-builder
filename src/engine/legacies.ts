import type { StructuredNote } from './archetypes/base';
import type { Power } from '../types/data';
import { CSM_LEGACY_NOTES } from './codex_csm/legacies';
import { getGKLegacyPower } from './codex_grey_knights/legacies';
import { getGSCLegacyPowerName } from './codex_genestealer_cults/legacies';

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
 *
 * TWO factions have this mechanic, not one. Grey Knights carry the power text in their own map;
 * Genestealer Cults name a power that already exists in the codex's "Legacy Psychic Powers"
 * discipline, so it is resolved out of `disciplines` rather than duplicated here — pass them in.
 * All six GSC legacies did nothing at all until this was wired.
 *
 * Returns null for any other faction, when no legacy is active, or when the named power is not in
 * the data (so a renamed power degrades to "no power" rather than to a crash).
 */
export function getLegacyExtraPower(
  faction: string,
  legacyName: string,
  disciplines?: Record<string, Power[]>,
): { name: string; details: Power } | null {
  if (faction === 'Grey Knights') return getGKLegacyPower(legacyName);
  if (faction === 'Genestealer Cults') {
    const powerName = getGSCLegacyPowerName(legacyName);
    if (!powerName || !disciplines) return null;
    for (const list of Object.values(disciplines)) {
      const details = list.find((p) => p.name === powerName);
      if (details) return { name: powerName, details };
    }
    return null;
  }
  return null;
}
