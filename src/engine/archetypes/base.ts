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
  /**
   * Restricts the `alliedFaction` roster-injection to ONLY these unit names (by exact name),
   * instead of the faction's whole roster — e.g. Adeptus Mechanicus' Dark Mechanicum grants just
   * 5 named Chaos Space Marine daemon-engines (Venomcrawler/Defiler/Forgefiend/Maulerfiend/
   * Heldrake, ods-verbatim "...may be taken from the Chaos Space Marine army list"), not all of
   * CSM. Empty/unset = no restriction (the existing whole-roster behaviour, e.g. CSM Daemonkin →
   * all of Chaos Daemons). Distinct from `allowedUnitsOnly`, which restricts the PRIMARY faction's
   * own roster, not the injected one.
   */
  alliedUnitsOnly?: string[];
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
   * cap's strict-Infantry definition — see validators.ts isStrictInfantrySelection). Verified
   * faction-by-faction against each digest: enabled for IG (Cavalry Regiment, Mechanised
   * Company), SM/GSC/Votann/Orks (all via fastArchetype) and Custodes (Kataphraktoi — same
   * M<12"-conditional wording, confirmed in rules-model/adeptus_custodes.md). Eldar's Windhost
   * already gets this for free via fastArchetype. Sororitas' Holy Vanguard (all Dominion models,
   * unconditional) and Tyranids' Tyrannocyte Assault (all units, unconditional — dropPodArchetype)
   * are a DIFFERENT rule shape — mandatory embark regardless of Movement, not an M<12" selection
   * gate — and correctly do not use this field.
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
  /**
   * Grants every unit with Armory access ongoing, UNCAPPED use of another faction's general
   * Armory (weapons + non-veteran/non-vehicle equipment) — distinct from `alliedFaction` (which
   * additionally opens that faction's whole unit roster for direct selection, wrong for these
   * cases) and from "Authority of the Inquisition" (player-chosen faction, capped at 1 item —
   * see AUTHORITY_SOURCE in ArmoryModal.tsx). Closes ki-ig-traitor-guard-archetype-01's "access
   * to X armory" lines (IG-only so far: Traitor Guard → 'chaos_space_marines', Brood Brothers →
   * 'genestealer_cults', Gue'vesa → 'tau_empire' — each ods-verbatim "Models with Armory access
   * may also use the <Faction> Armory", no cap stated unlike the Inquisition rule).
   */
  armoryOnlyFaction?: string | null;
  /**
   * Caps a specific slot's max BELOW whatever the engagement's AOP/multiAop would otherwise
   * allow (distinct from `hqOverride`, which only stops HQ from being multiplied, and from
   * `bannedSlots`, which bans a slot outright rather than capping it) — e.g. IG Mechanised
   * Company's "May only take a single Heavy Support selection" (ods-verbatim), which has no
   * other structural field able to express "1, not however many the AOP table would give".
   */
  slotCapOverride?: { slot: string; max: number } | null;
  /**
   * Stricter than `requiresHqUnit`: the army must field at least one HQ unit (name match, same
   * substring convention) that ALSO has a specific option-group choice selected — e.g. AdMech
   * Cybernetica Cohort's "must take at least one Magos or Archmagos WITH the Datasmith upgrade"
   * (Archmagos is a variant promotion of Magos, same RosterEntry/unitName, so the unit-name match
   * alone already covers both). `choiceName` is matched against the unit's OWN `option_groups`
   * choices (not armory) by exact name.
   */
  requiresHqUpgrade?: { unitNameContains: string; choiceName: string } | null;
  /**
   * Caps how many Troops selections OTHER than `anchorUnit` are allowed, scaled by how many
   * copies of `anchorUnit` are in the army — e.g. IG Whiteshields' "You are only allowed one
   * other Troop selection per Conscript Infantry Platoon in your army" (ods-verbatim). With 0
   * Conscript Infantry Platoons, 0 other Troops selections are allowed: the Troops slot must be
   * built around the anchor unit, not just capped overall like `slotCapOverride`.
   */
  troopsRatioCap?: { anchorUnit: string; perAnchor: number } | null;
  /**
   * Caps how many `cappedUnit` selections may count as Troops (via `troopsRemap`, which is
   * otherwise unconditional), scaled by the TOTAL MODEL COUNT (sum of `RosterEntry.size`, not
   * unit count) across `sourceUnits` — e.g. Sororitas Penitent Crusade's "For every 10
   * Arco-flagellant MODELS, one Penitent Engines unit may also count as Troops" and Tau Stealth
   * Cadre's "For every 6 models of Stealth Shas'ui and/or Stealth Shas've, one Ghostkeel
   * Battlesuit unit may be taken as Troops" (both ods-verbatim — model count, not units, unlike
   * `troopsRatioCap`). `cappedUnit` still needs its own entry in `troopsRemap` for the slot
   * re-mapping itself; this only adds the ratio ceiling on top, as a validator-only error rather
   * than dynamically un-remapping individual entries (keeps the existing slot-membership
   * computation chain untouched).
   */
  troopsModelRatioCap?: { sourceUnits: string[]; modelsPerUnit: number; cappedUnit: string } | null;
  /**
   * Grants a free HQ slot for `unitName`, scaled by game size rather than by another unit's
   * count — e.g. Votann Hearthfyre Arsenal's "For every 500 points of game size, a single
   * Brôkhyr Iron-master may be included that does not take up an HQ slot" (ods-verbatim). Unlike
   * Eldar Warlocks' near-identical "1 per 500pts" shape, there's no per-unit inline flag to gate
   * on (every copy of `unitName` is eligible) and the grant is archetype-specific, not a
   * universal unit ability — hence a rule field rather than a hardcoded faction function.
   */
  pointsBasedHqFree?: { unitName: string; perPoints: number } | null;
  /**
   * Units listed here don't count toward the 25% Troops requirement, while every OTHER Troops
   * unit still does (the normal `troopsCount: 'all'` behaviour) — e.g. Votann Hearthfyre
   * Arsenal's "Hearthkyn Warriors do not count towards the 25% Troops requirement" (ods-verbatim).
   * Distinct from `troopsCount: 'remap'`, which is an INCLUSION list (ONLY troopsRemap units
   * count) — this is an EXCLUSION of specific units from an otherwise-normal count.
   */
  troopsCountExclude?: string[];
  /**
   * Requires at least 1 `escortUnit` selection in the army for every `troopsUnit` selection
   * counted as Troops (via `troopsRemap`) — e.g. AdMech Servitor Maniple's "For each Servitor
   * unit taken as Troops, the army must also take a Tech-priest" (ods-verbatim). The Tech-priest's
   * OWN free-Elite-slot grant for this pairing is a separate, universal unit ability (see
   * `computeServitorFreeSlots`, unconditional regardless of archetype) — this field only adds the
   * MANDATORY count requirement that archetype text states on top of it.
   */
  requiresEscortPerTroopsUnit?: { troopsUnit: string; escortUnit: string } | null;
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
