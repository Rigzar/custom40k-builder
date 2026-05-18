export interface ArchetypeRule {
  /** Unit names whose effective slot becomes 'Troops' */
  troopsRemap: string[];
  /** All non-locked units must have this mark assigned */
  forcedMark: string | null;
  /** Only units whose locked_mark === forcedMark (or no locked mark) are allowed */
  requireForcedMarkOnly: boolean;
  /** Unit names explicitly banned */
  bannedUnits: string[];
  /** Override HQ slot [min, max] – replaces engagement defaults when present */
  hqOverride: [number, number] | null;
  /** When non-empty, only these unit names can fill the HQ slot */
  hqAllowed: string[];
  /** Animosity checks are skipped */
  noAnimosity: boolean;
  /** Legacy selectors are hidden/disabled */
  noLegacy: boolean;
  /** Trait pool is hidden/disabled */
  noTraits: boolean;
  /**
   * 25% Troops calculation: 'all' | 'locked' | 'remap'
   *  - 'all': all troops count (default)
   *  - 'locked': only troops with locked_mark === forcedMark count
   *  - 'remap': only units in troopsRemap count
   */
  troopsCount: 'all' | 'locked' | 'remap';
  /** Units without veteran abilities are banned (Legionnaire Warband) */
  requireVetAbilities: boolean;
  /**
   * Allied faction slug to unlock (e.g. 'chaos_daemons').
   * Null = no allied units.
   */
  alliedFaction: string | null;
  /**
   * When alliedFaction is set:
   *  - 'forced': only allied units with locked_mark === forcedMark
   *  - 'hq_mark': only allied units with locked_mark === state.hqMark (or unlocked)
   *  - 'all': all allied units
   */
  alliedMarkFilter: 'forced' | 'hq_mark' | 'all';
  /** Notes shown in the UI under the archetype description */
  notes: string[];
}

function cultArchetype(mark: string, troopsUnit: string): ArchetypeRule {
  return {
    troopsRemap: [troopsUnit],
    forcedMark: mark,
    requireForcedMarkOnly: true,
    bannedUnits: ['Legionnaires'],
    hqOverride: null,
    hqAllowed: [],
    noAnimosity: false,
    noLegacy: true,
    noTraits: true,
    troopsCount: 'locked',
    requireVetAbilities: false,
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

export const ARCHETYPE_RULES: Record<string, ArchetypeRule> = {
  'Blood for the Blood God!': cultArchetype('Khorne', 'Khorne Berzerkers'),
  'All is Dust':               cultArchetype('Tzeentch', 'Rubric Marines'),
  'Ambition for Perfection':   cultArchetype('Slaanesh', 'Noise Marines'),
  'Plaguehost':                cultArchetype('Nurgle',   'Plague Marines'),

  'Host Raptorial': {
    troopsRemap: ['Raptors', 'Warptalons'],
    forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: false, noTraits: false, troopsCount: 'remap', requireVetAbilities: false,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      'Raptors and Warptalons count as Troops.',
      'Only Raptor units count towards the 25% Troops requirement.',
      'At least half of Raptor models must start in reserves.',
    ],
  },

  'The Swift Blade': {
    troopsRemap: ['Chaos Bikers'],
    forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: false, noTraits: false, troopsCount: 'all', requireVetAbilities: false,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      'Chaos Bikers count as Troops.',
      'Flanking units may deploy on turn 1.',
      'Units with M<12" and no transport option cannot be selected.',
    ],
  },

  'Sorcerer Circle': {
    troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: [1, 4], hqAllowed: ['Chaos Sorcerer', 'Master of Sorcery'],
    noAnimosity: false, noLegacy: false, noTraits: false,
    troopsCount: 'all', requireVetAbilities: false,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      '4 HQ slots (minimum 1, maximum 4).',
      'Only Chaos Sorcerer and Master of Sorcery as HQ.',
      'Chaos Sorcerers gain the "Command squad" ability.',
      'All models must deploy within ≤12" of each other.',
    ],
  },

  "Abaddon's Chosen": {
    troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: [4, 5], hqAllowed: [], noAnimosity: true,
    noLegacy: false, noTraits: false, troopsCount: 'all', requireVetAbilities: false,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      '5 HQ slots (minimum 4 must be filled).',
      'Each HQ must have a different Chaos Mark.',
      'No Animosity restrictions.',
    ],
  },

  'Legionnaire Warband': {
    troopsRemap: ['Legionnaires'],
    forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: false, noTraits: false, troopsCount: 'all', requireVetAbilities: true,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      'Legionnaires count as Troops.',
      'All units must have at least 1 veteran ability (Marks do not count towards this requirement).',
      'Units without access to veteran abilities cannot be selected.',
    ],
  },

  'Special Operations': {
    troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: false, noTraits: false, troopsCount: 'all', requireVetAbilities: false,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      'Cultists must choose 2 veteran abilities, one of which must be "Infiltrator".',
    ],
  },

  'Daemonkin': {
    troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: true, noTraits: true, troopsCount: 'all', requireVetAbilities: false,
    alliedFaction: 'chaos_daemons', alliedMarkFilter: 'hq_mark',
    notes: [
      'Access to all Chaos Daemons units (filtered by HQ Mark).',
      'All units must carry the same Chaos Mark.',
      'At least 1 HQ from each Codex (CSM and Daemons).',
      'No Legacies or Traits may be chosen.',
    ],
  },

  'Dreadclaw Assault': {
    troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: false, noTraits: false, troopsCount: 'all', requireVetAbilities: false,
    alliedFaction: null, alliedMarkFilter: 'all',
    notes: [
      'All units begin the game as passengers in a Dreadclaw Drop Pod.',
      'Half the Drop Pods arrive automatically on turn 1; the rest on turn 2.',
    ],
  },

  'Legion': {
    troopsRemap: ['Legion Breacher Squad', 'Legion Tactical Squad', 'Legion Tactical Support Squad'],
    forcedMark: null, requireForcedMarkOnly: false, bannedUnits: [],
    hqOverride: null, hqAllowed: [], noAnimosity: false,
    noLegacy: false, noTraits: false, troopsCount: 'remap', requireVetAbilities: false,
    alliedFaction: 'horus_heresy_space_marine_supplement', alliedMarkFilter: 'all',
    notes: [
      'Access to all Horus Heresy Space Marines supplement units.',
      'Only HH supplement Troops (Breacher, Tactical, Tactical Support) count towards the 25%.',
    ],
  },
};

export function getArchetypeRule(archetype: string): ArchetypeRule | null {
  return ARCHETYPE_RULES[archetype] ?? null;
}

/** Returns the effective slot for a unit given the active archetype rule. */
export function getEffectiveSlot(
  unitName: string,
  originalSlot: string,
  rule: ArchetypeRule | null,
): string {
  if (rule && rule.troopsRemap.includes(unitName)) return 'Troops';
  return originalSlot;
}

/**
 * Returns false if the unit is banned or incompatible with the archetype.
 * Pass the unit's locked_mark and has_veteran_abilities from the data.
 */
export function isUnitAllowed(
  unitName: string,
  unit: { locked_mark: string | null; has_veteran_abilities: boolean },
  rule: ArchetypeRule | null,
): boolean {
  if (!rule) return true;
  if (rule.bannedUnits.includes(unitName)) return false;
  if (rule.requireForcedMarkOnly && rule.forcedMark) {
    if (unit.locked_mark && unit.locked_mark !== rule.forcedMark) return false;
  }
  if (rule.requireVetAbilities && !unit.has_veteran_abilities) return false;
  return true;
}

/** Returns the HQ [min, max] limits given the active archetype rule and engagement. */
export function getEffectiveHqLimits(
  rule: ArchetypeRule | null,
  engagementHq: [number, number],
): [number, number] {
  if (rule?.hqOverride) return rule.hqOverride;
  return engagementHq;
}

/**
 * Returns whether a unit in the Troops slot counts toward the 25% minimum.
 * Used to implement cult archetype and Host Raptorial Troops restrictions.
 */
export function countsTroops(
  unitName: string,
  lockedMark: string | null,
  rule: ArchetypeRule | null,
): boolean {
  if (!rule || rule.troopsCount === 'all') return true;
  if (rule.troopsCount === 'locked') {
    return lockedMark === rule.forcedMark;
  }
  if (rule.troopsCount === 'remap') {
    return rule.troopsRemap.includes(unitName);
  }
  return true;
}
