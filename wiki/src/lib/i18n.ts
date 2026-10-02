/**
 * Wiki i18n — the wiki is a STATIC Astro site, so translation is applied at BUILD time, not at
 * runtime. Pick the language with the `WIKI_LANG` env var (en | de | es | ru | ja); default en.
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
import { WIKI_BUILTIN } from './i18n-builtin';
import RU_RULES from '../vendor/src/data/ruleDescriptions.ru.json';
import JA_RULES from '../vendor/src/data/ruleDescriptions.ja.json';

export type WikiLang = 'en' | 'de' | 'es' | 'ru' | 'ja';
/** Every language the wiki is built in, in the order the language switcher lists them. */
export const WIKI_LANGS: { code: WikiLang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
];
// build-time env var (Node). import.meta.env only exposes PUBLIC_-prefixed vars, so read process.env.
const RAW_LANG = (typeof process !== 'undefined' && process.env.WIKI_LANG) || 'en';
export const WIKI_LANG: WikiLang = (['en', 'de', 'es', 'ru', 'ja'].includes(RAW_LANG) ? RAW_LANG : 'en') as WikiLang;

/** English source for every UI/chrome string in the wiki. */
export const WIKI_STRINGS = {
  // nav + chrome
  navHome: 'Home', navFactions: 'Factions', navMissions: 'Missions', navRules: 'Core Rules', navGlossary: 'Glossary',
  footerDiscord: 'Custom40k Discord',
  // stat table
  colProfile: 'Profile', colPts: 'Pts', colMin: 'Min', colMax: 'Max',
  // weapon table
  colWeapon: 'Weapon', colRange: 'Range', colType: 'Type', colAbilities: 'Abilities',
  // breadcrumbs / shared
  crumbHome: 'Home', crumbAllFactions: 'All factions', crumbGlossary: 'Glossary', crumbUnits: 'Units',
  // glossary
  glossaryHeading: 'Rules glossary',
  glossaryIntro: '{n} special rules, weapon abilities, and universal keywords.',
  glossaryRuleLabel: 'Special Rule',
  glossaryBack: 'Back to Glossary',
  // factions index
  factionsIntro: 'Faction codices — units, weapons, abilities and points, generated from the canonical data.',
  // faction sub-pages
  headingArmyCustomisation: 'Army Customisation',
  headingArmory: 'Armory',
  headingWeapons: 'Weapons',
  headingEquipment: 'Equipment',
  // The codex Armory sheets keep vehicle gear and veteran abilities in their own sections;
  // production tags them with a `category`, so the wiki prints them under their own headings
  // rather than mixed into the general Equipment list.
  headingVehicleEquipment: 'Vehicle Equipment',
  headingVeteranAbilities: 'Veteran Abilities',
  headingDaemonWeapons: 'Daemon Weapons',
  headingWargearOptions: 'Wargear Options',
  headingAbilities: 'Abilities',
  headingPsychicPowers: 'Psychic Powers',
  colPower: 'Power', colTarget: 'Target', colCast: 'Cast',
  // datasheet-embedded fixed power (e.g. Grey Knights Dreadnought's "Fortitude", Eldar
  // Spiritseer's "Craftsong") — printed on the unit's own sheet, not part of a discipline list
  alwaysKnownBadge: 'Always Known', castLabel: 'Cast:',
  // missions
  missionsEngagementTypes: 'Engagement Types',
  missionsScoring: 'Scoring',
  missionsSecondary: 'Secondary Objectives',
  missionsList: 'Mission List',
  // hub buttons, section headings and badges that used to be hard-coded in the pages
  navUnits: 'Units', navWarbands: 'Warbands',
  headingArchetypes: 'Archetypes', headingLegacies: 'Legacies', headingTraits: 'Traits', headingWarbands: 'Warbands',
  badgeCharacter: 'Character', badgePsyker: 'Psyker',
  modelSingular: 'model', modelPlural: 'models', ptsWord: 'pts',
  badgeVehicle: "Vehicle", badgeMonster: "Monster", badgeArmoryAccess: "Armory access", badgeChampionArmory: "Champion armory", badgeVeteran: "Veteran abilities",
  // force-organisation slots
  slotHQ: 'HQ', slotTroops: 'Troops', slotElites: 'Elites', slotFastAttack: 'Fast Attack', slotHeavySupport: 'Heavy Support',
  slotDedicatedTransport: 'Dedicated Transport', slotFortifications: 'Fortifications', slotFlyers: 'Flyers', slotLordsOfWar: 'Lords of War',
  // home page
  homeTagline: 'Rules · Factions · Armory · Missions',
  homeH1: '1. What is Custom40k?',
  homeP1: 'Custom40k is a complete, ready-to-play homebrew ruleset for Warhammer 40,000 that has been in development for the past 2+ years and has become the default system for a local group of about ~15 people. The rules aim to modernise, streamline, and rebalance the "classic era" rules (3rd–7th edition) while still supporting every model GW has ever made across all armies, and bringing back army and model customisation via extensive armories for every faction.',
  homeH2: '2. What are the key differences to current 40k?',
  homeKey1Title: 'Alternating activation:', homeKey1Text: 'Each player only activates one unit at a time, which leads to less downtime and less lethality.',
  homeKey2Title: 'Backwards compatibility:', homeKey2Text: 'Every model that GW released for Warhammer (and will release in the future) is playable and supported with rules.',
  homeKey3Title: 'Balance:', homeKey3Text: "Since its inception, Custom40k has been finetuned over 100+ games to ensure that all units are playable and have a purpose in the game. Points are calculated using a unified points calculator. Balancing for a game like 40k is an ever ongoing endeavour, but I'm doing my best to keep all armies and units on an even level.",
  homeKey4Title: 'Huge customisation:', homeKey4Text: 'Where GW has a strict "No model, no rules" policy, "Customisation" is the name of the game. Each faction features their own, ever expanding armory full of options for character models, units and army composition. Kitbashing and creativity is explicitly desired.',
  homeKey5Title: 'Old school systems:', homeKey5Text: 'Armor Values for vehicles and the Force Organisation Chart are back.',
  homeH3: '3. What do you need to play Custom40k?',
  homeP3: 'Apart from the regular things for a normal game of Warhammer, what you need in addition are so called "Command tokens". Command tokens are used at the beginning of every battle round to determine what actions a unit may be allowed to do during its activation. While we 3d printed our own tokens for this, a suitable replacement would be a simple deck of cards for each player. You need four different cards (hearts, diamonds, spades, clover) as there are 4 different commands.',
  homeCta: 'Browse the factions →',
  discordTitle: 'Stay up to date',
  discordText: 'Questions about the rules, balance updates, or new faction lists? The Custom40k community lives on Discord — come ask, report bugs, or just roll dice with us.',
  discordBtn: 'Join Discord',
  langLabel: 'Language',
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
  const builtin = WIKI_LANG === 'en' ? undefined : WIKI_BUILTIN[WIKI_LANG]?.[key];
  return O[WIKI_LANG]?.ui?.[key] ?? builtin ?? WIKI_STRINGS[key];
}

/** The force-organisation slot name in the reader's language ("Heavy Support" → "Тяжёлая поддержка"). */
const SLOT_KEYS: Record<string, WikiKey> = {
  'HQ': 'slotHQ', 'Troops': 'slotTroops', 'Elites': 'slotElites', 'Fast Attack': 'slotFastAttack',
  'Heavy Support': 'slotHeavySupport', 'Dedicated Transport': 'slotDedicatedTransport',
  'Fortifications': 'slotFortifications', 'Flyers': 'slotFlyers', 'Lords of War': 'slotLordsOfWar',
};
export function wtSlot(slot: string): string {
  const key = SLOT_KEYS[slot];
  return key ? wt(key) : slot;
}

/** "3 models" / "1 model" in the reader's language. */
export function wtModels(n: number): string {
  return `${n} ${wt(n === 1 ? 'modelSingular' : 'modelPlural')}`;
}

/** Translate a UI key and interpolate `{name}` placeholders. */
export function wtf(key: WikiKey, vars: Record<string, string | number>): string {
  return wt(key).replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''));
}

/** Translate a content string by namespace + id, falling back to the given English text. */
const BUILTIN_RULES: Partial<Record<WikiLang, Record<string, string>>> = { ru: RU_RULES, ja: JA_RULES };
export function wtContent(namespace: 'glossary' | 'armyRules', id: string, english: string): string {
  const builtin = namespace === 'glossary' ? BUILTIN_RULES[WIKI_LANG]?.[id] : undefined;
  return O[WIKI_LANG]?.[namespace]?.[id] ?? builtin ?? english;
}
