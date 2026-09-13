import type { TranslationKey } from '../i18n';

/**
 * The faction catalogue — the list of playable factions, their category, their review status and
 * the codex document version each one was audited against.
 *
 * This used to live inside `LandingPage.tsx`, which meant the admin panel had to import a UI
 * component to read data. It is plain data used by three unrelated screens (the Faction step, the
 * admin availability/codex-version editors, and the public settings merge), so it lives here.
 */

export type FactionStatus = 'complete' | 'testing' | 'inreview' | 'unreviewed';

export interface FactionDef {
  key: string;
  name: string;
  available: boolean;
  status: FactionStatus;
  /** Codex document version (from the faction's canonical .ods title), shown on the button. */
  version?: string;
}

export interface FactionCategory {
  name: string;
  icon: string;
  /** Category label colour on the DARK theme: a pale tint, made to sit on a near-black page. */
  pillFg: string;
  /**
   * The same label on the LIGHT theme. Not derivable from `pillFg` — those tints measure 2.0-2.8:1
   * on white, which is why the category headings washed out there. Same hue, enough depth to read.
   */
  pillFgLight: string;
  dividerColor: string;
  factions: FactionDef[];
}

export const STATUS_DOT: Record<FactionStatus, string> = {
  complete:   'bg-green-500',
  testing:    'bg-amber-400',
  inreview:   'bg-orange-500',
  unreviewed: 'bg-red-500',
};

export const STATUS_I18N_KEY: Record<FactionStatus, TranslationKey> = {
  complete:   'fullyReviewed',
  testing:    'needsTesting',
  inreview:   'inReview',
  unreviewed: 'notReviewed',
};

export const CATEGORIES: FactionCategory[] = [
  {
    name: 'Chaos',
    icon: '/category-icons/chaos.svg',
    pillFg: '#cc8888', pillFgLight: '#8a3236', dividerColor: '#3a1a1a',
    factions: [
      { key: 'chaos_space_marines', name: 'Chaos Space Marines', available: true, status: 'complete', version: '1.04' },
      { key: 'chaos_daemons',       name: 'Chaos Daemons',       available: true, status: 'complete', version: '1.01' },
    ],
  },
  {
    name: 'Imperium',
    icon: '/category-icons/imperium.svg',
    pillFg: '#c8b56a', pillFgLight: '#6b5a17', dividerColor: '#3a3520',
    factions: [
      { key: 'space_marines',      name: 'Space Marines',      available: true, status: 'complete', version: '1.05' },
      { key: 'imperial_guard',     name: 'Imperial Guard',     available: true, status: 'complete', version: '1.05' },
      { key: 'adeptus_mechanicus', name: 'Adeptus Mechanicus', available: true, status: 'testing', version: '1.01' },
      { key: 'adeptus_custodes',   name: 'Adeptus Custodes',   available: true, status: 'testing', version: '1.01' },
      { key: 'adeptus_sororitas',  name: 'Adeptus Sororitas',  available: true, status: 'complete', version: '1.01' },
      { key: 'grey_knights',       name: 'Grey Knights',       available: true, status: 'complete', version: '1.01' },
      { key: 'inquisition',        name: 'Inquisition',        available: true, status: 'testing', version: '1.01' },
    ],
  },
  {
    name: 'Xenos',
    icon: '/category-icons/xenos.svg',
    pillFg: '#6ab88a', pillFgLight: '#1d6944', dividerColor: '#1a3a28',
    factions: [
      { key: 'tau_empire',        name: 'Tau Empire',        available: true, status: 'testing', version: '1.01' },
      { key: 'necrons',           name: 'Necrons',           available: true, status: 'complete', version: '1.11' },
      { key: 'orks',              name: 'Orks',              available: true, status: 'complete', version: '1.02' },
      { key: 'eldar',             name: 'Eldar',             available: true, status: 'complete', version: '1.01' },
      { key: 'dark_eldar',        name: 'Dark Eldar',        available: true, status: 'complete', version: '1.01' },
      { key: 'genestealer_cults', name: 'Genestealer Cults', available: true, status: 'complete', version: '1.02' },
      { key: 'harlequins',        name: 'Harlequins',        available: true, status: 'testing', version: '1.01' },
      { key: 'leagues_of_votann', name: 'Leagues of Votann', available: true, status: 'complete', version: '1.02' },
      { key: 'tyranids',          name: 'Tyranids',          available: true, status: 'complete', version: '1.06' },
    ],
  },
];

/** Flat {key,name,defaultAvailable} list of every faction — used by the admin availability toggles. */
export const ALL_FACTIONS: { key: string; name: string; defaultAvailable: boolean }[] =
  CATEGORIES.flatMap(c => c.factions.map(f => ({ key: f.key, name: f.name, defaultAvailable: f.available })));

/**
 * The versions compiled into this build — what the admin editor starts from and what the app
 * falls back to when the DB has nothing to say. Keeping the code defaults means a wiped or
 * unreachable settings row can never blank the badges.
 */
export const DEFAULT_CODEX_VERSIONS: Record<string, { version: string; status: FactionStatus }> =
  Object.fromEntries(CATEGORIES.flatMap(c => c.factions.map(f =>
    [f.key, { version: f.version ?? '1.00', status: f.status }])));

export function getFactionName(key: string): string {
  for (const cat of CATEGORIES) {
    const f = cat.factions.find(f => f.key === key);
    if (f) return f.name;
  }
  return key;
}
