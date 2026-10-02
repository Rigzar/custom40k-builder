/**
 * Build the wiki in every language into ONE `dist/` folder:
 *
 *   dist/            English (the default — the URLs that already exist keep working)
 *   dist/de/ …       German, Spanish, Russian, Japanese: pages only
 *
 * The wiki is a static Astro site whose language is fixed at build time (`WIKI_LANG`, see
 * src/lib/i18n.ts), so each language is one full build. To keep the deployment small and the
 * pages free of any base-path plumbing, only the HTML is duplicated: images, fonts and CSS are
 * language-independent, so a translated page keeps pointing at the single copy at the root.
 * What changes in a translated page is every link to another PAGE (`/factions/...`, `/glossary`,
 * `/rules`, `/missions`, `/`), which gets the language prefix so a reader stays in their language.
 * The language-switcher links in the header are marked `data-lang-switch` and are left alone.
 *
 *   node scripts/build-all.mjs            # every language
 *   node scripts/build-all.mjs ru ja      # just these (English is always built first, it owns the assets)
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST = join(ROOT, 'dist');
const TMP = join(ROOT, '.build');
const ALL = ['en', 'de', 'es', 'ru', 'ja'];
const wanted = process.argv.slice(2).filter(l => ALL.includes(l));
const langs = ['en', ...(wanted.length ? wanted : ALL).filter(l => l !== 'en')];

/** Links to other pages of the wiki — the only hrefs that get the language prefix. */
const PAGE_HREF = /\bhref="(\/(?:factions|glossary|rules|missions)(?:[/?#"][^"]*)?|\/(?=["?#]))/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function localise(html, lang) {
  return html.replace(/<a\b[^>]*>/g, tag => {
    if (tag.includes('data-lang-switch')) return tag;
    return tag.replace(PAGE_HREF, (_m, path) => `href="/${lang}${path === '/' ? '/' : path}`);
  });
}

function build(lang, outDir) {
  console.log(`\n[wiki] building ${lang} …`);
  execFileSync(process.execPath, [join(ROOT, 'node_modules', 'astro', 'astro.js'), 'build', '--outDir', outDir], {
    cwd: ROOT, stdio: 'inherit', env: { ...process.env, WIKI_LANG: lang },
  });
}

rmSync(DIST, { recursive: true, force: true });
rmSync(TMP, { recursive: true, force: true });

// English owns the root of dist/, including every shared asset.
build('en', DIST);

for (const lang of langs.filter(l => l !== 'en')) {
  const out = join(TMP, lang);
  build(lang, out);
  let pages = 0, assets = 0;
  for (const file of walk(out)) {
    const rel = relative(out, file);
    if (file.endsWith('.html')) {
      const dest = join(DIST, lang, rel);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, localise(readFileSync(file, 'utf8'), lang), 'utf8');
      pages++;
    } else if (!existsSync(join(DIST, rel))) {
      // a hashed bundle that only this language produced — keep it so its pages still load
      mkdirSync(dirname(join(DIST, rel)), { recursive: true });
      cpSync(file, join(DIST, rel));
      assets++;
    }
  }
  console.log(`[wiki] ${lang}: ${pages} pages → dist/${lang}/ (+${assets} extra assets)`);
}
rmSync(TMP, { recursive: true, force: true });
console.log(`\n[wiki] done: ${langs.join(', ')}`);
