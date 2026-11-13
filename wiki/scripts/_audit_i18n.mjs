import { readFileSync, existsSync } from 'node:fs';
const strip = h => h.replace(/<(script|style)[\s\S]*?<\/\1>/g,'').replace(/<[^>]+>/g,'\n').replace(/&#38;/g,'&').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").split('\n').map(s=>s.trim()).filter(s=>s.length>25 && /[a-z]{4}/i.test(s));
const pages = ['', 'rules', 'missions', 'glossary', 'factions', 'factions/space_marines', 'factions/space_marines/archetypes', 'factions/space_marines/armory', 'factions/space_marines/psychic', 'factions/space_marines/hq/captain', 'factions/orks', 'glossary/ward', 'factions/tyranids/units'];
for (const l of ['de','es','ru','ja']) {
  for (const p of pages) {
    const en = 'dist/' + p + (p?'/':'') + 'index.html', tr = 'dist/' + l + '/' + p + (p?'/':'') + 'index.html';
    if (!existsSync(en) || !existsSync(tr)) { console.log(l, p || '/', 'MISSING', !existsSync(en)?'en':'', !existsSync(tr)?'tr':''); continue; }
    const a = strip(readFileSync(en,'utf8')), b = new Set(strip(readFileSync(tr,'utf8')));
    const same = a.filter(s => b.has(s));
    console.log(l, (p||'/').padEnd(40), 'long lines', String(a.length).padStart(4), 'untranslated', String(same.length).padStart(4), (100*same.length/Math.max(1,a.length)).toFixed(0)+'%');
  }
}
