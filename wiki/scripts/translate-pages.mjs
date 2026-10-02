/**
 * Translate the long hand-written wiki pages (Core Rules, Missions) in a localised build.
 * Used by build-all.mjs: for each leaf block of the page (see page-blocks.mjs) whose English text has an
 * entry in src/data/page-translations/<lang>.json, the block's inner HTML is replaced; anything without
 * an entry stays English. Astro's scoped-style attribute is re-added to every tag of the translation.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { leafBlocks, norm } from './page-blocks.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const cache = {};
function table(lang) {
  if (cache[lang] === undefined) {
    const f = path.join(ROOT, 'src', 'data', 'page-translations', `${lang}.json`);
    cache[lang] = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
  }
  return cache[lang];
}

/** The big page heading (<h1>), which the shared-chrome filter keeps out of the string tables. */
const TITLES = {
  de: { rules: 'Grundregeln', missions: 'Missionen' },
  es: { rules: 'Reglas básicas', missions: 'Misiones' },
  ru: { rules: 'Основные правила', missions: 'Миссии' },
  ja: { rules: '基本ルール', missions: 'ミッション' },
};
const H1 = { rules: 'Core Rules', missions: 'Missions' };

export function translatePage(html, lang, page) {
  html = html.replace(new RegExp(`(<h1[^>]*>)${H1[page]}(</h1>)`), `$1${TITLES[lang]?.[page] ?? H1[page]}$2`);
  const tr = table(lang)[page];
  if (!tr) return html;
  const withCid = (s, cid) => (cid ? s.replace(/<([a-zA-Z][a-zA-Z0-9]*)(?=[\s>\/])/g, `<$1 ${cid}`) : s);
  const blocks = leafBlocks(html).sort((a, b) => b.start - a.start);
  let out = html;
  for (const b of blocks) {
    const t = tr[norm(b.inner)];
    if (!t) continue;
    const lead = b.inner.match(/^\s*/)[0], trail = b.inner.match(/\s*$/)[0];
    // Astro's scoped-style id is the page component's own (not the layout's): read it off the block itself
    const startTag = html.slice(html.lastIndexOf('<', b.start - 1), b.start);
    const cid = (startTag.match(/data-astro-cid-[a-z0-9]+/) ?? b.inner.match(/data-astro-cid-[a-z0-9]+/) ?? [''])[0];
    out = out.slice(0, b.start) + lead + withCid(t, cid) + trail + out.slice(b.end);
  }
  return out;
}
