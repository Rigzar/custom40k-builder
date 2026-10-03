/**
 * Names and rule tokens in the reader's script, for the static wiki — the same pure helpers the
 * app draws names with (vendored from src/utils/localName.ts), driven by WIKI_LANG at build time.
 *
 * Only Japanese turns names into katakana (a Japanese reader asked for it); German, Spanish and
 * Russian keep the game's English names, as their players do. The data itself is never changed:
 * these functions run where a name is DRAWN, so slugs, links and lookups keep using the English key.
 */
import NAMES_JA from '../vendor/src/data/names.ja.json';
import { jaName, jaRules, localEquipped, setNameTable } from '../vendor/src/utils/localName';
import { unitTypeLabel } from '../vendor/src/utils/unitTypeLabel';
import { localiseAbility } from '../vendor/src/data/coreRules';
import { WIKI_LANG, wtSlot } from './i18n';
import { phrase } from './phrases';

if (WIKI_LANG === 'ja') setNameTable(NAMES_JA as Record<string, string>);

/** A unit, weapon, option, power or faction name. */
export const wn = (name: string): string => (WIKI_LANG === 'ja' && typeof name === 'string' ? jaName(name) : name);
/** A weapon type or a comma-separated ability list ("Rapid Fire 1", "Sunder(1), Auto Hit"). */
export const wr = (rules: string): string => (WIKI_LANG === 'ja' && typeof rules === 'string' ? jaRules(rules) : rules);
/** "Character model, Infantry" and friends. */
export const wUnitType = (type: string): string => (typeof type === 'string' ? unitTypeLabel(WIKI_LANG, type) : type);
/** The "X is equipped with: A; B" line. */
export const wEquipped = (text: string): string => (typeof text === 'string' ? localEquipped(text, WIKI_LANG) : text);
/** A range such as 6" radius. */
export const wRange = (range: string): string => typeof range !== 'string' ? range : range.replace(/\s*radius$/i, ` ${localiseAbility('radius')}`);
/** A force-organisation slot, or (on the Escalation pages) a faction name used as a slot. */
export const wSlot = (slot: string): string => {
  const t = wtSlot(slot);
  return t !== slot ? t : wn(slot);
};
/** A label or sentence typed into a page (src/lib/phrases.ts). */
export const wp = (text: string): string => (typeof text === 'string' ? phrase(WIKI_LANG, text) : text);
/** A short descriptive phrase from the text table ("Instant", "Friendly unit"). */
export const wPhrase = (text: string): string => (typeof text === 'string' ? localiseAbility(text) : text);
