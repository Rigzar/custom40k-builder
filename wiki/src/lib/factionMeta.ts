// Category grouping mirrors src/components/LandingPage.tsx's CATEGORIES array exactly, so the
// wiki home page is organised the same way as the main app's faction picker.

export interface FactionCategory {
  name: string;
  icon: string;
  pillFg: string;
  dividerColor: string;
  factionKeys: string[];
}

export const CATEGORIES: FactionCategory[] = [
  {
    name: 'Chaos',
    icon: '/category-icons/chaos.svg',
    pillFg: '#cc8888',
    dividerColor: '#3a1a1a',
    factionKeys: ['chaos_space_marines', 'chaos_daemons'],
  },
  {
    name: 'Imperium',
    icon: '/category-icons/imperium.svg',
    pillFg: '#c8b56a',
    dividerColor: '#3a3520',
    factionKeys: [
      'space_marines', 'imperial_guard', 'adeptus_mechanicus', 'adeptus_custodes',
      'adeptus_sororitas', 'grey_knights', 'inquisition',
    ],
  },
  {
    name: 'Xenos',
    icon: '/category-icons/xenos.svg',
    pillFg: '#6ab88a',
    dividerColor: '#1a3a28',
    factionKeys: [
      'tau_empire', 'necrons', 'orks', 'eldar', 'dark_eldar',
      'genestealer_cults', 'harlequins', 'leagues_of_votann', 'tyranids',
    ],
  },
  {
    name: 'Supplements',
    icon: '/category-icons/imperium.svg',
    pillFg: '#9a9aa8',
    dividerColor: '#28283a',
    factionKeys: ['assassins'],
  },
];

/** Placeholder copy — replace with the real per-faction blurb when supplied. */
export const FACTION_DESCRIPTIONS: Record<string, string> = {};

export function getFactionDescription(key: string): string {
  return FACTION_DESCRIPTIONS[key] ?? 'Description coming soon.';
}
