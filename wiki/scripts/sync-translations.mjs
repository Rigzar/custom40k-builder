/**
 * Pull the admin-edited translations into the wiki.
 *
 * The wiki is a static Astro site, so its text is fixed at BUILD time — the translations a
 * maintainer types into the app's admin panel live in the database and never reach it on their own.
 * This is the missing half: it reads them once and writes `src/data/wiki-translations.json`, which
 * `src/lib/i18n.ts` already imports.
 *
 *   node scripts/sync-translations.mjs                 # from the live site
 *   node scripts/sync-translations.mjs <url|file>      # from another deployment, or a saved export
 *
 * Deliberately fail-soft: if the fetch fails, the existing file is left alone and the build goes on
 * in English. A wiki that builds in the wrong language is a problem; one that builds is not.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'src', 'data', 'wiki-translations.json');
const SOURCE = process.argv[2] ?? 'https://custom40k-builder.vercel.app/api/settings';

/** The app keys glossary entries as "rule.<key>.name" / ".desc"; the wiki wants them by rule key. */
function toWikiShape(translations) {
  const out = {};
  for (const [lang, strings] of Object.entries(translations ?? {})) {
    if (lang === 'en' || !strings) continue;          // English is the source, never an override
    const ui = {}, glossary = {};
    for (const [key, value] of Object.entries(strings)) {
      if (!value) continue;
      const rule = key.match(/^rule\.(.+)\.(name|desc)$/);
      // Rule NAMES stay English here on purpose — the wiki treats them as canonical identifiers
      // (see the note in src/lib/i18n.ts), so only descriptions cross over. Datasheet ability texts
      // are app-only for now; the wiki has no place to put them yet.
      if (rule) { if (rule[2] === 'desc') glossary[rule[1]] = value; }
      else if (!key.startsWith('ab.')) ui[key] = value;
    }
    out[lang] = { ui, glossary };
  }
  return out;
}

async function read(source) {
  if (!/^https?:/.test(source)) return JSON.parse(fs.readFileSync(source, 'utf8'));
  const r = await fetch(source);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

try {
  const payload = await read(SOURCE);
  const shaped = toWikiShape(payload.translations ?? payload);
  fs.writeFileSync(OUT, JSON.stringify(shaped, null, 2) + '\n', 'utf8');
  const counts = Object.entries(shaped)
    .map(([l, v]) => `${l}: ${Object.keys(v.ui).length} ui + ${Object.keys(v.glossary).length} glossary`)
    .join(' · ');
  console.log(`wiki translations updated from ${SOURCE}\n  ${counts || '(none yet — everything stays English)'}`);
} catch (err) {
  console.warn(`wiki translations NOT updated (${err.message}) — keeping the existing file`);
}
