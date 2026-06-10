export type ArchetypeNoteCategory =
  | 'troops'       // Slot remapping — unit X counts as Troops
  | 'requirement'  // Mandatory rule — validated by engine
  | 'restriction'  // Something banned or blocked — validated by engine
  | 'mechanic'     // Special engine effect — applied automatically
  | 'in_game';     // Pure gameplay rule — informational only, not enforced by builder

export interface StructuredNote {
  category: ArchetypeNoteCategory;
  text: string;
}

export interface ArchetypeRule {
  troopsRemap: string[];
  forcedMark: string | null;
  requireForcedMarkOnly: boolean;
  bannedUnits: string[];
  bannedSlots: string[];
  hqOverride: [number, number] | null;
  hqAllowed: string[];
  requiresHqUnit: string | null;
  noAnimosity: boolean;
  noLegacy: boolean;
  noTraits: boolean;
  troopsCount: 'all' | 'locked' | 'remap';
  requireVetAbilities: boolean;
  /** Units listed here gain veteran ability access even if has_veteran_abilities is false in data. */
  grantVetAbilities: string[];
  /** Units listed here gain the "Command Squad" ability (can join a unit that already has a
   * character attached) — e.g. Librarian Conclave grants it to Librarians. */
  grantsCommandSquad: string[];
  demoteOtherTroops: boolean;
  alliedFaction: string | null;
  alliedMarkFilter: 'forced' | 'hq_mark' | 'all';
  allowedUnitsOnly: string[];
  notes: string[];
  /** Structured notes for rich UI display. When present, rendered instead of plain notes[]. */
  structuredNotes?: StructuredNote[];
  /**
   * When set, this archetype grants the whole army access to a supplement's armory as a
   * legion-style tab (e.g. Legion → 'Horus Heresy'). The supplement's armory_general is injected
   * into the host's armory_legions under this key, and the key is treated as an active legion key
   * for every army unit — gated by access only, no mark. Mirrors how a Legacy grants a legion armory.
   * NOT used for unit-only grants like Daemonkin (daemons keep their own codex armory, no cross-access).
   */
  sharedSupplementArmory?: string;
}

export const BASE: ArchetypeRule = {
  troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false,
  bannedUnits: [], bannedSlots: [], hqOverride: null, hqAllowed: [],
  requiresHqUnit: null, noAnimosity: false, noLegacy: false, noTraits: false,
  troopsCount: 'all', requireVetAbilities: false, grantVetAbilities: [], grantsCommandSquad: [], demoteOtherTroops: false,
  alliedFaction: null, alliedMarkFilter: 'all', allowedUnitsOnly: [], notes: [],
};

export function cultArchetype(mark: string, troopsUnit: string): ArchetypeRule {
  return {
    ...BASE,
    troopsRemap: [troopsUnit],
    forcedMark: mark,
    requireForcedMarkOnly: true,
    bannedUnits: ['Legionnaires'],
    noLegacy: true,
    noTraits: true,
    troopsCount: 'locked',
    alliedFaction: 'chaos_daemons',
    alliedMarkFilter: 'forced',
    notes: [
      `All units must carry the Mark of ${mark}.`,
      `${troopsUnit} counts as Troops.`,
      `Only units with locked Mark of ${mark} count towards the 25% Troops requirement.`,
      `Access to Chaos Daemons units with the Mark of ${mark}.`,
      'Legionnaires not allowed. No Legacies or Traits may be chosen.',
    ],
  };
}

export function fastArchetype(remapUnits: string[], extraNotes: string[] = []): ArchetypeRule {
  return {
    ...BASE,
    troopsRemap: remapUnits,
    notes: [
      `${remapUnits.join(' and ')} count${remapUnits.length === 1 ? 's' : ''} as Troops.`,
      'Units with M<12" must start the game as passengers inside a transport.',
      'Units with M<12" that have no transport option cannot be selected.',
      ...extraNotes,
    ],
  };
}

export function dropPodArchetype(vehicleName: string): ArchetypeRule {
  return {
    ...BASE,
    notes: [
      `All units must start the game as passengers inside a ${vehicleName}.`,
      `Half of all ${vehicleName}s (round up) arrive automatically in round 1. The rest arrive in round 2.`,
    ],
  };
}
