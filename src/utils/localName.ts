/**
 * Names in the reader's script — for now Japanese katakana only.
 *
 * A Japanese reader asked (Liquid Citrus, 2026-10-03): *"could we change the names of rules, units,
 * weapons, etc. in the Japanese version from English alphabet to katakana? It's the Japanese way to
 * write foreign words phonetically."*
 *
 * THE NAME ITSELF NEVER CHANGES. Unit, weapon and option names are the keys the whole engine matches
 * on (an option's choice is found by comparing its name with a weapon's), so translating the data
 * would silently break every rule. Instead this module turns a name into katakana at the moment it
 * is DRAWN, and only when the language is Japanese: `nm(w.name)` in a component, nothing in the data.
 *
 * The table (src/data/names.ja.json, ~4,500 names) is loaded on demand so the other four languages
 * never download it. Until it has arrived `nm` returns the English name, then the language store is
 * nudged so every component draws again.
 *
 * A name that is not in the table is returned unchanged — a missing entry shows English, never
 * nothing and never a wrong word.
 */
import { useLanguage } from '../i18n';

let TABLE: Record<string, string> | null = null;
let loading = false;

/** Trailing marker glyphs the sheets put after a name (ᴹ ᴱ ᶜᵘ …): kept as they are, not translated. */
const GLYPHS = /[ʰ-˿ᴬ-ᶿ⁰-₟†‡*ⓘ]+$/;
const NUMBER_WORDS: Record<string, string> = {
  one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
};
const norm = (s: string) => s.replace(GLYPHS, '').replace(/[’‘]/g, "'").trim().toLowerCase();

function ensureLoaded() {
  if (TABLE || loading) return;
  loading = true;
  import('../data/names.ja.json').then(m => {
    TABLE = (m as unknown as { default: Record<string, string> }).default;
    // Same nudge the admin translation editor uses: components subscribed through useT() redraw.
    useLanguage.setState(s => ({ i18nVersion: s.i18nVersion + 1 }));
  }).catch(() => { loading = false; });
}

/** Whole-name lookup, glyph-tolerant. */
function exact(s: string): string | undefined {
  if (!TABLE) return undefined;
  return TABLE[norm(s)];
}

/**
 * Katakana for a name, or the name itself when there is none. Handles the shapes the data really
 * uses: "Plasma gun - Standard", "Plasma gun (Standard)", "Heavy bolter and Meltagun",
 * "Blacksun filterᴵ".
 */
export function jaName(raw: string): string {
  if (!TABLE) { ensureLoaded(); return raw; }
  const s = raw.trim();
  if (!s) return raw;

  const whole = exact(s);
  if (whole) return whole + (s.match(GLYPHS)?.[0] ?? '');

  // "Two plague spewers" / "one Heavy bolter": a number in words in front of the name.
  const counted = s.match(/^(one|two|three|four|five|six|seven|eight|nine|ten)\s+(.+)$/i);
  if (counted) {
    const rest = jaName(counted[2]);
    if (rest !== counted[2]) return `${NUMBER_WORDS[counted[1].toLowerCase()]} ${rest}`;
  }
  // "2 Heavy flamers" / "- Melee": a figure or a dash in front of the name stays where it is.
  const lead = s.match(/^(\d+x?|\d+ ×|-|—)\s+(.+)$/);
  if (lead) {
    const rest = jaName(lead[2]);
    if (rest !== lead[2]) return `${lead[1]} ${rest}`;
  }
  // "The Sword of Souls"
  const article = s.match(/^the\s+(.+)$/i);
  if (article) { const rest = jaName(article[1]); if (rest !== article[1]) return rest; }
  // a plural that has no entry of its own: "lascannons" -> "lascannon" (Japanese has no plural)
  if (/s$/i.test(s)) { const one = exact(s.slice(0, -1)); if (one) return one; }

  // "X - Mode", "X- Mode" or "X (Mode)": translate the weapon and its mode separately.
  const mode = s.match(/^(.+?)(?: - |- )(.+)$/) ?? s.match(/^(.+?) \((.+)\)$/);
  if (mode) {
    const base = exact(mode[1]);
    if (base) {
      const m = exact(mode[2]);
      const paren = / \(.+\)$/.test(s);
      return paren ? `${base} (${m ?? mode[2]})` : `${base} - ${m ?? mode[2]}`;
    }
  }

  // "A and B" / "A & B": two things taken together.
  const parts = s.split(/\s+(?:and|&)\s+/i);
  if (parts.length > 1) {
    const out = parts.map(p => jaName(p));
    if (out.some((p, i) => p !== parts[i])) return out.join('と');
  }
  return raw;
}

/** Use this wherever a name is DRAWN. Returns the name unchanged unless the language is Japanese. */
export function nm(raw: string): string {
  return useLanguage.getState().language === 'ja' ? jaName(raw) : raw;
}


// ── "Every X is equipped with: A; B; C." ────────────────────────────────────────────────────────
//
// 98% of the 670 loadout sentences in the game have exactly this frame, so they are translated by
// template instead of sentence by sentence: nothing to keep in step with the sheets, and a weapon
// that gets renamed there is translated the moment the name table knows it. The card already prints
// the heading ("Standard loadout:"), so the output is only WHO, then WHAT: "全モデル：A、B、C".
// Only the Japanese version also turns the names into katakana; German, Spanish and Russian keep
// the game's English names, as their players do.
const FRAME = /^(?:(Every|Each|The|An?) )?(.+?) (?:is|are) (?:(?:a single (?:character )?model|a character model) (?:and )?)?(additionally )?equipped with:\s*(.+?)\.?$/i;

type Lang = 'en' | 'de' | 'es' | 'ru' | 'ja';
const EVERY = (d?: string) => !!d && /^(every|each)$/i.test(d);

function who(lang: Lang, subject: string, everyIn: boolean, extra: boolean): string {
  let every = everyIn;
  // "model", "models" and "All models" all mean the whole squad
  const bare = /^(?:all )?models?$/i.test(subject.trim());
  if (/^all /i.test(subject.trim())) every = true;
  const name = lang === 'ja' ? jaName(subject) : subject;
  switch (lang) {
    case 'ja': return `${bare ? (every ? '全モデル' : 'モデル') : (every ? `全${name}` : name)}${extra ? '（追加）' : ''}`;
    case 'de': return `${bare ? (every ? 'Alle Modelle' : 'Modell') : (every ? `Alle „${name}“` : `„${name}“`)}${extra ? ' (zusätzlich)' : ''}`;
    case 'es': return `${bare ? (every ? 'Todos los modelos' : 'Modelo') : (every ? `Todos los «${name}»` : `«${name}»`)}${extra ? ' (además)' : ''}`;
    case 'ru': return `${bare ? (every ? 'Все модели' : 'Модель') : (every ? `Все «${name}»` : `«${name}»`)}${extra ? ' (дополнительно)' : ''}`;
    default: return name;
  }
}

/** The loadout text in the reader's language. Anything that is not in the usual frame is returned as it was. */
export function localEquipped(text: string, lang: Lang = useLanguage.getState().language): string {
  if (!text || lang === 'en') return text;
  if (lang === 'ja' && !TABLE) ensureLoaded();
  const sentences = text.split(/(?<=\.)\s+(?=[A-Z])/).map(x => x.trim()).filter(Boolean);
  const out: string[] = [];
  for (const sent of sentences) {
    const m = sent.match(FRAME);
    if (!m) return text;                       // one odd sentence: keep the whole text as written
    // A sentence that swallowed the next one (the sheet lost a full stop) would come out half
    // translated; show it as written instead.
    if (/\b(?:is|are|equipped)\b/i.test(m[2]) || /\bequipped with\b|\b(?:is|are) (?:a|an|additionally)\b/i.test(m[4])) return text;
    const items = m[4].split(/\s*;\s*|\s*,\s+(?!and\b)/).map(x => x.trim()).filter(Boolean)
      .map(x => (lang === 'ja' ? jaName(x) : x));
    const sep = lang === 'ja' ? '、' : '; ';
    out.push(`${who(lang, m[2], EVERY(m[1]), !!m[3])}${lang === 'ja' ? '：' : ': '}${items.join(sep)}${lang === 'ja' ? '。' : '.'}`);
  }
  return out.join(lang === 'ja' ? '' : ' ');
}

/** Use this wherever a loadout sentence is DRAWN. */
export function eqText(text: string): string {
  return localEquipped(text);
}


// ── rule names on a weapon line: "Rapid Fire 1", "Sunder(1), Auto Hit, AT(2)" ───────────────────
/** One rule: the NAME is turned into katakana, the value after it ("(4+)", " 1", " ◆") stays as it is. */
function jaRuleOne(item: string): string {
  const mark = item.match(/\s*◆$/)?.[0] ?? '';
  const core = mark ? item.slice(0, item.length - mark.length) : item;
  const m = core.match(/^(.+?)(\(.*\)|\s+[0-9Xx+-][^\s]*)?$/);
  if (!m) return item;
  const name = jaName(m[1].trim());
  return name === m[1].trim() ? item : `${name}${m[2] ?? ''}${mark}`;
}

/** A weapon's type or its comma-separated abilities in the reader's language. */
export function jaRules(raw: string): string {
  if (!raw || raw === '-' || raw === '—') return raw;
  if (!TABLE) { ensureLoaded(); return raw; }
  return raw.split(/,\s*/).map(jaRuleOne).join(', ');
}

/** Use this wherever a weapon type or ability list is DRAWN. */
export function rl(raw: string): string {
  return useLanguage.getState().language === 'ja' ? jaRules(raw) : raw;
}

/** For the scripts that measure coverage: hand it the table directly. */
export function _setTableForTests(t: Record<string, string> | null) { TABLE = t; }
