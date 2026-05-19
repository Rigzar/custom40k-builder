export const SLOT_ORDER = [
  'HQ','Troops','Elites','Fast Attack',
  'Heavy Support','Dedicated Transport','Fortifications','Flyers',
] as const;
export type Slot = typeof SLOT_ORDER[number];

export interface AopLimits {
  HQ: [number, number];
  Troops: [number, number];
  Elites: [number, number];
  'Fast Attack': [number, number];
  'Heavy Support': [number, number];
  'Dedicated Transport': [number, number];
  Fortifications: [number, number];
  Flyers: [number, number];
}

export interface Engagement {
  name: string;
  range: string;
  default: number;
  aop: AopLimits;
  multiAop: boolean;
  minTroopsRatio: number;
  statCaps: boolean;
  notes: string;
}

export const ENGAGEMENTS: Record<string, Engagement> = {
  skirmish: {
    name: 'Skirmish', range: '1000–1500 pts', default: 1250,
    aop: {
      HQ: [0,1], Troops: [1,3], Elites: [0,1], 'Fast Attack': [0,1],
      'Heavy Support': [0,1], 'Dedicated Transport': [0,1], Fortifications: [0,0], Flyers: [0,0],
    },
    multiAop: false, minTroopsRatio: 0.25, statCaps: true,
    notes: 'HQ ≤150 pts · non-Troops ≤300 pts · no Archetypes · no Squadrons > 1 model',
  },
  pitched: {
    name: 'Pitched Battle', range: '2500–3500 pts', default: 2500,
    aop: {
      HQ: [1,2], Troops: [2,6], Elites: [0,3], 'Fast Attack': [0,3],
      'Heavy Support': [0,3], 'Dedicated Transport': [0,3], Fortifications: [0,1], Flyers: [0,1],
    },
    multiAop: true, minTroopsRatio: 0.25, statCaps: false,
    notes: 'Standard engagement · ≥25% Troops · multi-AOP allowed',
  },
  epic: {
    name: 'Epic Battle', range: '4000+ pts', default: 5000,
    aop: {
      HQ: [1,3], Troops: [2,6], Elites: [0,3], 'Fast Attack': [0,3],
      'Heavy Support': [0,3], 'Dedicated Transport': [0,3], Fortifications: [0,2], Flyers: [0,2],
    },
    multiAop: true, minTroopsRatio: 0.25, statCaps: false,
    notes: 'Large engagement · ≥25% Troops · multi-AOP allowed',
  },
};
