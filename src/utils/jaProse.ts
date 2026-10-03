/**
 * Japanese prose with the game's names in katakana.
 *
 * The translated rule texts keep the game's English names inline ("Deflect", "Mark of Chaos",
 * "Armory"). A Japanese reader asked for names in katakana, so after a text has been translated
 * the names in it are swapped for their entries in src/data/names.ja.json — the same table the
 * name layer uses. Longest name first, whole words only, so "Mark of Chaos" wins over "Chaos" and
 * a value such as the "(5+)" in "Deflagrate(5+)" stays exactly as written.
 *
 * This module has no imports on purpose: src/data/coreRules.ts uses it, and anything that pulled in
 * the translation store from here would make a cycle.
 */
let TABLE: Record<string, string> | null = null;
let RE: RegExp | null = null;
const CACHE = new Map<string, string>();

const norm = (s: string) => s.replace(/[’‘]/g, "'").toLowerCase();
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Hand the name table over (the app does it when the table arrives, the wiki at build time). */
export function setProseTable(t: Record<string, string> | null) {
  TABLE = t;
  CACHE.clear();
  if (!t) { RE = null; return; }
  const keys = Object.keys(t).filter(k => k.length >= 3 && /[a-z]/.test(k)).sort((a, b) => b.length - a.length);
  RE = new RegExp(`(?<![A-Za-z0-9'’-])(?:${keys.map(esc).join('|')})(?![A-Za-z0-9'’-])`, 'gi');
}

/** The text with every name it contains in katakana; the text itself when the table is not there yet. */
export function jaProse(text: string): string {
  if (!TABLE || !RE || !text) return text;
  const hit = CACHE.get(text);
  if (hit !== undefined) return hit;
  const out = text.replace(RE, m => TABLE![norm(m)] ?? m);
  CACHE.set(text, out);
  return out;
}
