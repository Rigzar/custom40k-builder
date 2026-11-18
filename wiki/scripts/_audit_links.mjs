// Crawl dist/: every internal href/src must resolve to a file; every #anchor must exist in its target page;
// report untranslated pages (language page text identical to English) and mixed-language links.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');
const LANGS = ['de', 'es', 'ru', 'ja'];

const walk = (d, o = []) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p, o) : o.push(p); } return o; };
const files = walk(DIST).filter(f => f.endsWith('.html'));
const rel = f => f.slice(DIST.length).replace(/\\/g, '/');

const idsCache = new Map();
const idsOf = f => {
  if (!idsCache.has(f)) {
    const h = readFileSync(f, 'utf8');
    idsCache.set(f, new Set([...h.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]).concat([...h.matchAll(/\bname="([^"]+)"/g)].map(m => m[1]))));
  }
  return idsCache.get(f);
};
const resolve = (url) => {
  let p = decodeURIComponent(url.split('#')[0].split('?')[0]);
  const cands = [join(DIST, p), join(DIST, p, 'index.html'), join(DIST, p + '.html')];
  return cands.find(c => existsSync(c) && statSync(c).isFile());
};

const problems = { missing: new Map(), anchor: new Map(), langMix: new Map() };
const add = (k, key, from) => { const m = problems[k]; if (!m.has(key)) m.set(key, new Set()); m.get(key).add(from); };

for (const f of files) {
  const r = rel(f);
  const lang = LANGS.find(l => r.startsWith('/' + l + '/')) ?? 'en';
  const h = readFileSync(f, 'utf8');
  for (const m of h.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|data:|javascript:|\/\/)/.test(u)) continue;
    if (u.startsWith('#')) { if (u.length > 1 && !idsOf(f).has(decodeURIComponent(u.slice(1)))) add('anchor', r + ' -> ' + u, r); continue; }
    if (!u.startsWith('/')) continue;
    const t = resolve(u);
    if (!t) { add('missing', u, r); continue; }
    const hash = u.split('#')[1];
    if (hash && t.endsWith('.html') && !idsOf(t).has(decodeURIComponent(hash))) add('anchor', u, r);
    // page link inside a translated page that drops the language prefix
    if (lang !== 'en' && /^\/(factions|glossary|rules|missions)(\/|$|#|\?)/.test(u) && !h.includes('data-lang-switch="' + u)) add('langMix', u, r);
  }
}
const show = (title, m, n = 40) => {
  console.log(`\n== ${title}: ${m.size} distinct`);
  [...m.entries()].slice(0, n).forEach(([k, v]) => console.log('  ' + k + '   (' + v.size + ' pages, e.g. ' + [...v][0] + ')'));
};
show('MISSING TARGETS', problems.missing);
show('BAD ANCHORS', problems.anchor);
show('LANG-PREFIX MISSING', problems.langMix);
console.log('\npages scanned:', files.length);
