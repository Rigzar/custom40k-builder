/**
 * List every translatable text block of the long, hand-written wiki pages (Core Rules, Missions).
 *
 * Those pages are plain HTML written straight into .astro files, so there is no string table to
 * translate. Instead the ENGLISH build is read back (see page-blocks.mjs) and each block is one
 * string; `translate-pages.mjs` (run by build-all.mjs) swaps it for its translation in the localised
 * copy of the page, so the Astro markup itself never has to change.
 *
 *   node scripts/extract-page-strings.mjs        # needs a built English dist/ (npm run build:en)
 *
 * Writes src/data/page-strings/<page>.json: the English strings, in page order, without Astro's
 * scoped-style attributes. A translation lives in src/data/page-translations/<lang>.json as
 * { "<English string>": "<translated string>" }; keep the inline tags (<strong>, <em>, <span class=…>).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leafBlocks, norm } from './page-blocks.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PAGES = ['rules', 'missions'];
const SHARED = /^(Home|Factions|Missions|Core Rules|Glossary|Custom40k Discord)$/;

fs.mkdirSync(path.join(ROOT, 'src', 'data', 'page-strings'), { recursive: true });
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, 'dist', page, 'index.html'), 'utf8');
  const seen = new Set();
  const list = [];
  for (const b of leafBlocks(html)) {
    const text = norm(b.inner);
    // the site header (nav links) is shared chrome, translated by the UI strings
    if (!text || SHARED.test(text) || text.startsWith('<a href="/"') || seen.has(text)) continue;
    seen.add(text); list.push(text);
  }
  fs.writeFileSync(path.join(ROOT, 'src', 'data', 'page-strings', `${page}.json`), JSON.stringify(list, null, 1), 'utf8');
  console.log(`${page}: ${list.length} strings, ${list.reduce((n, t) => n + t.length, 0)} chars`);
}
