/**
 * npx tsx scripts/_ja_names_test.ts
 * How much of the game's real naming does src/data/names.ja.json + src/utils/localName.ts cover?
 * Walks every faction's units/weapons/models/option choices/armory items, runs jaName() over each
 * and reports which names still come back in English.
 */
import fs from 'node:fs';
import path from 'node:path';
import { jaName, jaRules, localEquipped, _setTableForTests } from '../src/utils/localName';

const table = JSON.parse(fs.readFileSync('src/data/names.ja.json', 'utf8'));
_setTableForTests(table);

let pass = 0, fail = 0;
const eq = (got: unknown, want: unknown, name: string) => {
  const ok = got === want; ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  got ${got} want ${want}`}`);
};
eq(jaName('Bolter'), 'ボルター', 'plain name');
eq(jaName('bolter'), 'ボルター', 'case does not matter');
eq(jaName('Plasma gun - Standard'), 'プラズマガン - 標準', 'weapon - mode');
eq(jaName('Plasma gun (Overcharged)'), 'プラズマガン (オーバーチャージ)', 'weapon (mode)');
eq(jaName('Heavy bolter and Meltagun'), 'ヘヴィボルターとメルタガン', 'two things together');
eq(jaName('Blacksun filterᴵ'), 'ブラックサン・フィルターᴵ', 'marker glyph kept');
eq(jaName("Ancestor’s vengeance warhead"), '祖先の復讐の弾頭', 'curly apostrophe');
eq(jaName('A name nobody wrote'), 'A name nobody wrote', 'unknown name is returned unchanged');
eq(jaName(''), '', 'empty stays empty');


// ── the loadout sentences ──
eq(localEquipped('Every model is equipped with: Bolter; Bolt pistol; Frag grenades.', 'ja'), '全モデル：ボルター、ボルトピストル、フラグ・グレネード。', 'ja: every model');
eq(localEquipped('The Sergeant is equipped with: Power sword.', 'ja'), 'サージェント：パワーソード。', 'ja: the X');
eq(localEquipped('Every Plague Marine is additionally equipped with: Plague knife.', 'ja'), '全プレイグ・マリーン（追加）：プレイグ・ナイフ。', 'ja: additionally');
eq(localEquipped('Each Zorp is equipped with: Twin boltgun; Bolt pistol. The Biker Sergeant is equipped with: Power fist.', 'ja'), '全Zorp：ツイン・ボルトガン、ボルトピストル。バイカー・サージェント：パワーフィスト。', 'ja: two sentences, an unknown name stays English');
eq(localEquipped('All models are equipped with: Bolter.', 'ja'), '全モデル：ボルター。', 'ja: "All models" is the whole squad');
eq(localEquipped('Every model is equipped with: Bolter; Bolt pistol.', 'de'), 'Alle Modelle: Bolter; Bolt pistol.', 'de: names stay English');
eq(localEquipped('The Sergeant is equipped with: Power sword.', 'es'), '«Sergeant»: Power sword.', 'es: the X');
eq(localEquipped('Every Plague Marine is equipped with: Bolter.', 'ru'), 'Все «Plague Marine»: Bolter.', 'ru: every X');
eq(localEquipped('Acolyte/Penitent: Las pistol.', 'ja'), 'Acolyte/Penitent: Las pistol.', 'a line without the frame is left alone');
// a sentence that swallowed the next one (a lost full stop) is shown as written, never half translated
const glued = 'Every Dark Executioner is equipped with: Executioners blade, Frag grenades The Cult Demagogue is equipped with: Unholy stave, Las pistol.';
eq(localEquipped(glued, 'ja'), glued, 'glued sentences are left exactly as written');
eq(localEquipped('A Foetid Virion is equipped with: Blight grenades. A Biologus Putrifier is additionally equipped with: Injector pistol A Foul Blightspawn is additionally equipped with: Plague sprayer.', 'ja').includes('equipped with'), true, 'a sentence that swallowed the next one is not translated');
eq(localEquipped('Every model is equipped with: Bolter.', 'en'), 'Every model is equipped with: Bolter.', 'English is untouched');
let framed = 0, total = 0, changed = 0;
const eqSeen = new Set<string>();
(function walk(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.json') || !p.includes(`${path.sep}units${path.sep}`)) continue;
    let j: any; try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    if (Array.isArray(j.models) && typeof j.equipped_with === 'string' && j.equipped_with.trim()) eqSeen.add(j.equipped_with.trim());
  }
})('data/parsed');
const leftEnglish: string[] = [];
for (const t of eqSeen) {
  total++;
  const ja = localEquipped(t, 'ja');
  if (ja !== t) { changed++; if (/[A-Za-z]{4,}/.test(ja.replace(/[A-Za-z' -]+(?=[、。])/g, ''))) leftEnglish.push(ja); }
}
console.log(`loadout lines: ${total} distinct, ${changed} translated by template (${(changed / total * 100).toFixed(1)}%)`);
console.log('translated but with English words left (first 5):', leftEnglish.slice(0, 5));


// ── rule names on a weapon line ──
eq(jaRules('Rapid Fire 1'), 'ラピッドファイア 1', 'weapon type keeps its number');
eq(jaRules('Sunder(1), Auto Hit, AT(2)'), 'サンダー(1), オートヒット, AT(2)', 'abilities keep their values');
eq(jaRules('Poison(4+), Melta ◆'), 'ポイズン(4+), メルタ ◆', 'the changed-by-a-trait marker stays');
eq(jaRules('-'), '-', 'a dash stays a dash');
eq(jaRules('Some rule nobody wrote(3)'), 'Some rule nobody wrote(3)', 'an unknown rule is left alone');

// coverage over the real data
const seen = new Map<string, string>();   // name -> kind
const add = (kind: string, n: unknown) => { if (typeof n === 'string' && n.trim() && !/^[-\d]/.test(n.trim())) seen.set(n, kind); };
(function walk(d: string) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    if (!p.endsWith('.json')) continue;
    let j: any; try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    if (p.includes(`${path.sep}units${path.sep}`) && Array.isArray(j.models)) {
      add('unit', j.name);
      for (const m of [...j.models, ...(j.variant_models ?? [])]) add('model', m.name);
      for (const w of j.weapons ?? []) if (w.range !== undefined) add('weapon', w.name);
      for (const g of j.option_groups ?? []) for (const c of g.choices ?? []) add('choice', c.name);
    }
  }
})('data/parsed');
const byKind: Record<string, { n: number; miss: string[] }> = {};
for (const [name, kind] of seen) {
  const k = (byKind[kind] ??= { n: 0, miss: [] });
  k.n++;
  if (jaName(name) === name) k.miss.push(name);
}
for (const [kind, v] of Object.entries(byKind)) {
  const cover = ((v.n - v.miss.length) / v.n * 100).toFixed(1);
  console.log(`${kind.padEnd(7)} ${String(v.n).padStart(5)} names, ${cover}% in katakana; still English: ${v.miss.slice(0, 8).join(' | ')}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
