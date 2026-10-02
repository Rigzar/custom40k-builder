/**
 * Every text cell of every unit tab -- including the extra lines inside a multi-line cell and cells
 * in other columns -- must show up somewhere in the unit's production JSON. A parser that reads
 * "column 0 of the WEAPON block" misses a weapon whose profile sits in a second line of a cell or
 * in a far column; this checks the TEXT instead of the structure.
 *
 *   node scripts/cell_coverage.cjs [faction_dir]      (reads Codex/<sheet>.ods)
 */
const X = require('xlsx'), fs = require('fs'), path = require('path');
const FILES = { adeptus_custodes: 'Adeptus Custodes 1.01', adeptus_mechanicus: 'Adeptus Mechanicus 1.01', adeptus_sororitas: 'Adeptus Sororitas 1.01', assassins: 'Assassins 1.01', chaos_daemons: 'Chaos Daemons 1.01', chaos_space_marines: 'Chaos Space Marines 1.05', dark_eldar: 'Dark Eldar 1.01', eldar: 'Eldar 1.02', genestealer_cults: 'Genestealer Cults 1.02', grey_knights: 'Grey Knights 1.01', harlequins: 'Harlequins 1.01', inquisition: 'Inquisition 1.01', leagues_of_votann: 'Leagues of Votann 1.02', necrons: 'Necrons 1.11', orks: 'Orks 1.03', tau_empire: 'Tau Empire 1.02', space_marines: 'Space Marines 1.05', imperial_guard: 'Imperial Guard 1.05', tyranids: 'Tyranids 1.08' };
const only = process.argv[2];
const nz = s => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\bmay\b|\bcan\b/g, 'x').replace(/saving throw/g, 'save').replace(/[^a-z0-9]/g, '');
const HEADERS = new Set(['weapon', 'range', 'type', 's', 'ap', 'd', 'abilities', 'options', 'optionen', 'unit type', 'no.', 'name', 'points', 'infantry', 'vehicle', 'monstrous creature', 'character model', 'flyer', 'walker', 'bike', 'jump pack infantry', 'monstrous infantry', 'melee', '-', '*']);
const SKIP_TAB = /^(Index|Army Customisation|Armory|Doctrina|Canticles|Psychic|Warlord|Relic|General|.*Armory)$/i;
let grand = 0;
for (const [fac, ods] of Object.entries(FILES)) {
  if (only && only !== fac) continue;
  const wb = X.readFile('Codex/' + ods + '.ods');
  const root = `data/parsed/${fac}/units`; const prod = [];
  for (const s of fs.readdirSync(root, { withFileTypes: true })) if (s.isDirectory())
    for (const fn of fs.readdirSync(path.join(root, s.name)).filter(x => x.endsWith('.json'))) {
      const t = fs.readFileSync(path.join(root, s.name, fn), 'utf8'); const j = JSON.parse(t);
      prod.push({ n: nz(j.name), fn: nz(fn.replace('.json', '')), t: nz(t), name: j.name });
    }
  for (const tab of wb.SheetNames) {
    if (SKIP_TAB.test(tab) || /armory|psychic|discipline/i.test(tab)) continue;
    const rows = X.utils.sheet_to_json(wb.Sheets[tab], { header: 1, defval: '', raw: false });
    const u = prod.find(p => p.n === nz(rows[0]?.[0] || tab) || p.n === nz(tab) || p.fn === nz(tab) || p.n === nz(tab + 's') || p.n === nz(tab.replace(/s$/, '')));
    if (!u) continue;
    const miss = [];
    rows.forEach((r, ri) => r.forEach(cell => {
      for (const raw of String(cell).split('\n')) {
        const line = raw.replace(/\s+/g, ' ').trim();
        if (line.length < 4 || HEADERS.has(line.toLowerCase()) || /^[\d.\-+\/x"' ,]+$/.test(line) || /^[0-9]+-[0-9]+$/.test(line)) continue;
        if (/^\*? ?Choose one of the following|^Upgrades:?$/i.test(line)) continue;
        if (/^[+-]?\d+ points?$/i.test(line) || /access to (weapons|vehicle)|can gain (one )?a? ?Veteran|may gain one Veteran|gain a Veteran ability|Armory\.?$/i.test(line)) continue;
        // an ability list ("A, B(3), C"): every token must be present, in any order
        if (line.includes(', ') && !line.includes(':') && line.split(/,\s*(?![^()]*\))/).every(tk => u.t.includes(nz(tk)))) continue;
        // a bullet that carries its own price ("... for +46 points"): the item name before it must be present
        const bp = line.match(/^[•-]?\s*(.*?)\s+for \+?\d+ points?/i); if (bp && u.t.includes(nz(bp[1].replace(/^(Can|May) be equipped with (a |an |one )?/i, '')))) continue;
        const k = nz(line.replace(/^[-•]\s*/, '').replace(/\|.*$/, '').replace(/ \+?-?\d+ points?$/i, '')); if (!k) continue;
        if (u.t.includes(k)) continue;
        // a "Label: text" line is covered if its label is present
        const lab = line.includes(':') ? nz(line.slice(0, line.indexOf(':'))) : ''; if (lab && lab.length > 3 && u.t.includes(lab)) continue;
        miss.push(line.slice(0, 160));
      }
    }));
    const uniq = [...new Set(miss)];
    if (uniq.length) { grand += uniq.length; console.log(`\n## ${fac} / ${u.name}  (${tab})`); uniq.forEach(m => console.log('   ' + m)); }
  }
}
console.log('\nTOTAL uncovered lines:', grand);
