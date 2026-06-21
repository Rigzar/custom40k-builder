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
  /** Units listed here gain the "Command Squad" ability (can join a squad, or attach to a
   * single character on its own) — e.g. Librarian Conclave grants it to Librarians. */
  grantsCommandSquad: string[];
  demoteOtherTroops: boolean;
  alliedFaction: string | null;
  alliedMarkFilter: 'forced' | 'hq_mark' | 'all';
  allowedUnitsOnly: string[];
  /** Units with none of these keywords are blocked (empty = no filter). "-" keyword (Swords for hire) bypasses check. */
  allowedKeywords: string[];
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
  /**
   * A free, mandatory ability every eligible unit gains while this archetype is active — no
   * opt-out (Brood Brothers' Ambush, Gue'vesa's Supporting Fire; both ods-verbatim: "All
   * creature/units must gain the '<name>' ability for X pt(s) per Wound [or Y per Hull point]").
   * `creatureOnly: true` restricts the grant to non-vehicles (Brood Brothers' wording is "All
   * CREATURE units"; Gue'vesa's is "All units" — broader, vehicles pay pointsPerHull instead).
   */
  forcedAbility?: { name: string; pointsPerWound: number; pointsPerHull?: number; creatureOnly?: boolean } | null;
  /**
   * Units with Movement <12" must start embarked in a transport — blocked from selection
   * entirely if they have no transport option (rules-owner clarification 2026-06-20, re:
   * Cavalry Regiment Q5: "block it... greying it out... a mouse over tooltip"). "Transport
   * option" = the unit's unit_type is exactly "Infantry" (mirrors the Dedicated Transport AOP
   * cap's strict-Infantry definition — see validators.ts isStrictInfantrySelection). Currently
   * enabled only for archetypes verified against their own faction's canonical .ods this
   * session (IG Cavalry Regiment via fastArchetype, IG Mechanised Company) — NOT yet flipped on
   * for the textually-identical clause in other factions' archetypes (SM/GSC/Votann/Orks use
   * fastArchetype too and get this for free; Custodes/Eldar/Sororitas/Tyranids word it
   * differently in their own digests and haven't been individually re-grounded against their
   * .ods for this specific enforcement — left as informational-only pending that check).
   */
  lowMoveMustEmbark?: { creatureOnly?: boolean } | null;
  /**
   * Grants every main-faction unit the ability to purchase a Mark of Chaos via `item.mark`,
   * even though the unit has no native mark option group of its own (Traitor Guard — IG units
   * don't carry CSM-style mark groups in their data). Pricing and vet-slot consumption for
   * these units is computed separately in points.ts/resolver.ts (creatures: per-model-per-Wound,
   * Khorne/Slaanesh +1, Nurgle/Tzeentch +2; vehicles: flat +10 any mark — ods-verbatim, "point
   * cost per model and per Wound"). Rules owner confirmed 2026-06-20 (Q3): the mark counts as
   * a veteran ability for the unit, same as the CSM-side rule.
   */
  grantsMarkPurchase?: boolean;
}

export const BASE: ArchetypeRule = {
  troopsRemap: [], forcedMark: null, requireForcedMarkOnly: false,
  bannedUnits: [], bannedSlots: [], hqOverride: null, hqAllowed: [],
  requiresHqUnit: null, noAnimosity: false, noLegacy: false, noTraits: false,
  troopsCount: 'all', requireVetAbilities: false, grantVetAbilities: [], grantsCommandSquad: [], demoteOtherTroops: false,
  alliedFaction: null, alliedMarkFilter: 'all', allowedUnitsOnly: [], allowedKeywords: [], notes: [],
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
    lowMoveMustEmbark: {},
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
