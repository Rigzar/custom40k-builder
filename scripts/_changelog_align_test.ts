/**
 * npx tsx scripts/_changelog_align_test.ts
 * changelog.i18n.json is matched to the English bullets BY INDEX. Adding a bullet to changelog.ts
 * without adding its translations in the same position silently shows every later bullet under the
 * wrong text in de/es/ru/ja (it happened with the TTS checksum bullet). This checks the counts.
 */
import fs from 'node:fs';
const ts = fs.readFileSync('src/data/changelog.ts', 'utf8');
const i18n = JSON.parse(fs.readFileSync('src/data/changelog.i18n.json', 'utf8')) as Record<string, { changes: Record<string, string[]> }>;
let bad = 0;
for (const [version, entry] of Object.entries(i18n)) {
  const start = ts.indexOf(`version: '${version}'`);
  if (start < 0) continue;
  const end = ts.indexOf('\n    ],', start);
  const seg = ts.slice(start, end);
  const en = (seg.match(/^      ["']/gm) || []).length;
  for (const [lang, arr] of Object.entries(entry.changes)) {
    const ok = arr.length === en;
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${version} ${lang}: ${arr.length} translated vs ${en} English`);
  }
}
console.log(bad ? `\n${bad} misaligned` : '\nall aligned');
process.exit(bad ? 1 : 0);
