/**
 * Wiki i18n — the wiki is a STATIC Astro site, so translation is applied at BUILD time, not at
 * runtime. Pick the language with the `WIKI_LANG` env var (en | de | es); default en.
 *   WIKI_LANG=de npm run build   →  a German wiki
 *
 * Two layers of translatable text:
 *   1. UI / chrome  — nav, table headers, section titles, page labels. Keyed in WIKI_STRINGS below
 *      (English is the source). Use `wt('key')`.
 *   2. Rules content — the special-rules / weapon-ability glossary descriptions and the army-rules
 *      prose. Keyed by their own id (rule key / faction key). Use `wtContent(namespace, id, english)`.
 *
 * Overrides live in `src/data/wiki-translations.json`, shape:
 *   { "de": { "ui": { key: value }, "glossary": { ruleKey: text }, "armyRules": { … } }, "es": {…} }
 * That file is filled by the admin translation tool (fetched from the DB before a build — a later
 * stage); until then it's `{}` and everything renders in English. Unit / weapon / ability NAMES are
 * canonical rules data and are intentionally NOT translated here.
 */
import overrides from '../data/wiki-translations.json';

export type WikiLang = 'en' | 'de' | 'es';
// build-time env var (Node). import.meta.env only exposes PUBLIC_-prefixed vars, so read process.env.
const RAW_LANG = (typeof process !== 'undefined' && process.env.WIKI_LANG) || 'en';
export const WIKI_LANG: WikiLang = (['en', 'de', 'es'].includes(RAW_LANG) ? RAW_LANG : 'en') as WikiLang;

/** English source for every UI/chrome string in the wiki. */
export const WIKI_STRINGS = {
  // nav + chrome
  navHome: 'Home', navFactions: 'Factions', navMissions: 'Missions', navRules: 'Core Rules', navGlossary: 'Glossary',
  footerDiscord: 'Custom40k Discord',
  // stat table
  colProfile: 'Profile', colPts: 'Pts', colMin: 'Min', colMax: 'Max',
  // weapon table
  colWeapon: 'Weapon', colRange: 'Range', colType: 'Type', colAbilities: 'Abilities',
} as const;

export type WikiKey = keyof typeof WIKI_STRINGS;

type OverrideShape = Partial<Record<WikiLang, {
  ui?: Record<string, string>;
  glossary?: Record<string, string>;
  armyRules?: Record<string, string>;
  [ns: string]: Record<string, string> | undefined;
}>>;
const O = overrides as OverrideShape;

/** Translate a UI/chrome key (falls back to the English source). */
export function wt(key: WikiKey): string {
  return O[WIKI_LANG]?.ui?.[key] ?? WIKI_STRINGS[key];
}

/** Translate a content string by namespace + id, falling back to the given English text. */
export function wtContent(namespace: 'glossary' | 'armyRules', id: string, english: string): string {
  return O[WIKI_LANG]?.[namespace]?.[id] ?? english;
}
