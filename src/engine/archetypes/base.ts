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
  demoteOtherTroops: boolean;
  alliedFaction: string | null;
  alliedMarkFilter: 'forced' | 'hq_mark' | 'all';
  allowedUnitsOnly: string[];
  notes: string[];
}

export const BASE: ArchetypeRule = {
  troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false,
  bannedUnits: [], bannedSlots: [], hqOverride: null, hqAllowed: [],
  requiresHqUnit: null, noAnimosity: false, noLegacy: false, noTraits: false,
  troopsCount: 'all', requireVetAbilities: false, demoteOtherTroops: false,
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
