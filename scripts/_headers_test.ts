/**
 * npx tsx scripts/_headers_test.ts
 * Every option-group header in the game, through localiseAbility() — the very function the unit card
 * uses — in each language: is it translated, and does the translation keep the numbers?
 */
import fs from 'node:fs';
import path from 'node:path';
import { localiseAbility, setRuleLanguage } from '../src/data/coreRules';

const headers = new Set<string>();
(function walk(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.json') || !p.includes(`${path.sep}units${path.sep}`)) continue;
    let j: any; try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    if (!Array.isArray(j.models)) continue;
    for (const g of j.option_groups ?? []) if (typeof g.header === 'string' && g.header.trim()) headers.add(g.header);
  }
})('data/parsed');

let bad = 0;
for (const lang of ['de', 'es', 'ru', 'ja'] as const) {
  setRuleLanguage(lang);
  let missing = 0, lostNumber = 0; const examples: string[] = [];
  for (const h of headers) {
    const t = localiseAbility(h);
    if (t === h) { missing++; if (examples.length < 3) examples.push(h.slice(0, 70)); continue; }
    for (const n of h.match(/\d+/g) ?? []) if (!t.includes(n)) { lostNumber++; if (examples.length < 3) examples.push('NUMBER ' + n + ': ' + h.slice(0, 60)); break; }
  }
  const ok = missing === 0 && lostNumber === 0;
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${lang}: ${headers.size} headers, ${missing} untranslated, ${lostNumber} lost a number ${examples.length ? ' e.g. ' + examples.join(' | ') : ''}`);
}
console.log(`\n${4 - bad} of 4 languages complete`);
process.exit(bad ? 1 : 0);
