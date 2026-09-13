export const SLOT_ORDER = [
  'HQ','Troops','Elites','Fast Attack',
  'Heavy Support','Dedicated Transport','Fortifications','Flyers','Lords of War',
] as const;
export type Slot = typeof SLOT_ORDER[number];

/** Lords of War (Escalation) is "0+" in Epic only; the real cap is 33% of points, enforced
 *  in the validator. This sentinel keeps the count-based AOP loops effectively unbounded. */
export const LOW_UNLIMITED = 99;

export interface AopLimits {
  HQ: [number, number];
  Troops: [number, number];
  Elites: [number, number];
  'Fast Attack': [number, number];
  'Heavy Support': [number, number];
  'Dedicated Transport': [number, number];
  Fortifications: [number, number];
  Flyers: [number, number];
  'Lords of War': [number, number];
}

export interface Engagement {
  name: string;
  range: string;
  min: number;
  max: number;
  default: number;
  aop: AopLimits;
  multiAop: boolean;
  minTroopsRatio: number;
  statCaps: boolean;
  /** Hard ceiling on the army's Trait pool for this engagement, or null for "no extra limit".
   *  Skirmish is 1 (Missions supplement, "Only one Trait may be selected."); see maxArmyTraits. */
  maxTraits: number | null;
  notes: string;
}

/** Mini-AOP for allied detachments. */
export const ALLIED_AOP: AopLimits = {
  HQ:                    [0, 1],
  Troops:                [1, 2],
  Elites:                [0, 1],
  'Fast Attack':         [0, 1],
  'Heavy Support':       [0, 1],
  'Dedicated Transport': [0, 3],
  Fortifications:        [0, 0],
  Flyers:                [0, 0],
  'Lords of War':        [0, 0],
};

export const ENGAGEMENTS: Record<string, Engagement> = {
  skirmish: {
    name: 'Skirmish', range: '1000–1500 pts', min: 1000, max: 1500, default: 1250,
    aop: {
      HQ: [0,1], Troops: [1,3], Elites: [0,1], 'Fast Attack': [0,1],
      'Heavy Support': [0,1], 'Dedicated Transport': [0,1], Fortifications: [0,0], Flyers: [0,0],
      'Lords of War': [0,0],
    },
    multiAop: false, minTroopsRatio: 0.25, statCaps: true, maxTraits: 1,
    notes: 'HQ ≤150 pts · non-Troops ≤300 pts · no Archetypes · 1 Trait · no Squadrons > 1 model',
  },
  pitched: {
    name: 'Pitched Battle', range: '2500–3500 pts', min: 2500, max: 3500, default: 2500,
    aop: {
      HQ: [1,2], Troops: [2,6], Elites: [0,3], 'Fast Attack': [0,3],
      'Heavy Support': [0,3], 'Dedicated Transport': [0,3], Fortifications: [0,1], Flyers: [0,2],
      'Lords of War': [0,0],
    },
    multiAop: true, minTroopsRatio: 0.25, statCaps: false, maxTraits: null,
    notes: 'Standard engagement · ≥25% Troops · multi-AOP allowed',
  },
  epic: {
    name: 'Epic Battle', range: '4000+ pts', min: 4000, max: 50000, default: 5000,
    aop: {
      HQ: [1,2], Troops: [2,6], Elites: [0,3], 'Fast Attack': [0,3],
      'Heavy Support': [0,3], 'Dedicated Transport': [0,3], Fortifications: [0,1], Flyers: [0,2],
      'Lords of War': [0, LOW_UNLIMITED],
    },
    multiAop: true, minTroopsRatio: 0.25, statCaps: false, maxTraits: null,
    notes: 'Large engagement · ≥25% Troops · Lords of War allowed (max 33% pts) · multi-AOP allowed',
  },
};

/**
 * How many army Traits the roster may hold.
 *
 * Base budget is 2. A Legacy can grant an extra slot (IG "Ministorum World": trait_slot_bonus 1),
 * an Archetype can too (Dark Eldar "Coordinated Raid"), and a Planetary Assault campaign bonus
 * adds more still. On top of all that, an Engagement type can impose a HARD ceiling: the Missions
 * supplement added "Only one Trait may be selected." to the Skirmish restrictions in its September
 * 2026 revision, alongside the "No Archetypes may be selected." we already enforce. The ceiling
 * wins over every bonus, exactly like the no-Archetypes and no-allies restrictions do.
 *
 * Shared by the store (which clips the pool as the player picks) and the validator (which reports
 * an over-full pool), so the two can never disagree about the number -- the same reason
 * computeFreeSlotAdjustments() is shared.
 */
export function maxArmyTraits(
  engagement: string,
  legacyBonus: number,
  archetypeBonus: number,
  campaignBonus: number,
): number {
  const budget = 2 + legacyBonus + archetypeBonus + campaignBonus;
  const cap = ENGAGEMENTS[engagement]?.maxTraits;
  return cap == null ? budget : Math.min(budget, cap);
}
