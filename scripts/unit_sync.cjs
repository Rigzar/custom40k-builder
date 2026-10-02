/**
 * Apply the FACTS of a faction sheet to its unit JSON files: model points and stats, the fields of
 * weapons that exist on both sides, and weapons the sheet has that production lacks (single-profile
 * rows only). It prints every change; nothing is written without --write.
 *
 * It deliberately does NOT touch what needs judgement: equipped_with sentences, option groups,
 * ability texts, multi-profile weapons. Those are printed as "REVIEW" lines for a human to wire.
 *
 *   node scripts/unit_sync.cjs "<ods>" <faction_dir> [--write] [--only "Unit Name"]
 */
const XLSX = require('xlsx'), fs = require('fs'), path = require('path');
const [odsPath, fac] = process.argv.slice(2);
const write = process.argv.includes('--write');
const onlyIdx = process.argv.indexOf('--only'); const only = onlyIdx > 0 ? process.argv[onlyIdx + 1] : null;
const wb = XLSX.readFile(odsPath);
const sheetRows = n => XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, blankrows: false, defval: '', raw: false }).map(r => r.map(c => String(c).trim()));
const STAT_INF = ['M', 'WS', 'BS', 'S', 'T', 'W', 'I', 'A', 'LD', 'SV'];
const STAT_VEH = ['M', 'WS', 'BS', 'S', 'FRONT', 'SIDE', 'REAR', 'I', 'A', 'HP'];
function parseCount(raw) {
  const s = raw.trim(); if (!s || s === '*') return null;
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (iso) return { min: +iso[3], max: +iso[2] };
  const range = s.match(/^(\d+)\s*-\s*(\d+)$/); if (range) return { min: +range[1], max: +range[2] };
  const one = s.match(/^(\d+)$/); return one ? { min: +one[1], max: +one[1] } : null;
}
function parseUnitSheet(name) {
  const rows = sheetRows(name);
  const out = { name: rows[0]?.[0] || name, models: [], weapons: [], equipped: [] };
  let hdr = null, section = '';
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i], c0 = r[0], joined = r.join(',').replace(/,+$/, '');
    if (!joined.trim()) continue;
    if (c0 === 'No.') { hdr = r.includes('FRONT') ? STAT_VEH : STAT_INF; section = 'models'; continue; }
    if (/^WEAPON$/i.test(c0)) { section = 'weapons'; continue; }
    if (/^(OPTIONS|OPTIONEN)$/i.test(c0)) { section = 'options'; continue; }
    if (/^ABILITIES$/i.test(c0)) { section = 'abilities'; continue; }
    if (/^UNIT TYPE$/i.test(c0)) { section = 'unittype'; continue; }
    if (section === 'models') {
      const cnt = parseCount(c0);
      if (r[1] && (cnt || c0 === '*')) {
        const stats = {}; hdr.forEach((k, n) => { stats[k] = r[2 + n] ?? ''; });
        out.models.push({ name: r[1], min: cnt?.min ?? null, max: cnt?.max ?? null, points: Number(r[2 + hdr.length]) || null, stats, promotion: c0 === '*' });
        continue;
      }
      if (/equipped with/i.test(joined)) { out.equipped.push(r.find(x => /equipped with/i.test(x)) || joined); continue; }
    }
    if (section === 'weapons') {
      if (/^\*/.test(c0) || !c0 || c0 === '-') continue;
      const prof = c0.match(/^-\s*(.+)$/);
      const base = prof ? out.weapons[out.weapons.length - 1]?.base : c0.replace(/\*+$/, '').trim();
      const w = { name: prof ? `${base} - ${prof[1]}` : base, base, prof: !!prof, range: r[1] ?? '', type: r[2] ?? '', s: r[3] ?? '', ap: r[4] ?? '', d: r[5] ?? '', abilities: r[6] ?? '' };
      w.header = !prof && !w.range && !w.type; out.weapons.push(w);
    }
  }
  return out;
}
const n = s => String(s ?? '').replace(/\s+/g, ' ').replace(/[’‘`´]/g, "'").trim();
const eq = (a, b) => n(a).toLowerCase() === n(b).toLowerCase();
const abSet = s => new Set(n(s).split(/,\s*(?![^()]*\))/).map(x => x.toLowerCase()).filter(x => x && x !== '-'));
const sameAb = (a, b) => { const A = abSet(a), B = abSet(b); return A.size === B.size && [...A].every(x => B.has(x)); };
const sameStat = (a, b) => n(a).replace(/["”]/g, '"') === n(b).replace(/["”]/g, '"');

const root = `data/parsed/${fac}/units`;
const files = [];
for (const s of fs.readdirSync(root, { withFileTypes: true })) if (s.isDirectory())
  for (const fn of fs.readdirSync(path.join(root, s.name)).filter(x => x.endsWith('.json'))) files.push(path.join(root, s.name, fn));
const byName = new Map();
for (const f of files) { const j = JSON.parse(fs.readFileSync(f, 'utf8')); byName.set(n(j.name).toLowerCase(), { f, j }); }

const SKIP = /^(Index|Army Customisation|Armory|Doctrina|Canticles|Psychic|Warlord|Relic)/i;
let changes = 0;
for (const sheet of wb.SheetNames) {
  if (SKIP.test(sheet)) continue;
  const s = parseUnitSheet(sheet); if (!s.models.length) continue;
  if (only && s.name !== only && sheet !== only) continue;
  const hit = byName.get(n(s.name).toLowerCase()) || byName.get(n(sheet).toLowerCase()) ||
    [...byName.values()].find(x => eq(x.j.name, s.name) || eq(x.j.name, sheet) || eq(path.basename(x.f, '.json').replace(/_/g, ' '), sheet));
  if (!hit) { console.log(`\n## ${sheet}: NOT IN PRODUCTION (review)`); continue; }
  const { f, j } = hit; const log = []; let dirty = false;
  const all = [...(j.models || []), ...(j.variant_models || [])];
  for (const m of s.models) {
    const p = all.find(x => eq(x.name, m.name)); if (!p) { log.push(`REVIEW model "${m.name}" not in production`); continue; }
    if (!m.promotion && m.points != null && p.points !== m.points) {
      log.push(`points ${m.name}: ${p.points} -> ${m.points}`);
      const base = (j.models || []).includes(p);
      if (base) j.min_cost = (j.min_cost ?? 0) + (m.points - p.points) * (p.min ?? 1);
      p.points = m.points; dirty = true;
    }
    for (const [k, v] of Object.entries(m.stats)) {
      if (v === '' || p.stats?.[k] === undefined) continue;
      if (!sameStat(p.stats[k], v)) { log.push(`stat ${m.name} ${k}: ${p.stats[k]} -> ${v}`); p.stats[k] = v; dirty = true; }
    }
    if (!m.promotion && m.min != null && (p.min !== m.min || p.max !== m.max) && (j.models || []).includes(p)) log.push(`REVIEW count ${m.name}: ${p.min}-${p.max} vs sheet ${m.min}-${m.max}`);
  }
  for (const w of s.weapons) {
    if (w.header || w.prof) continue;
    const pw = (j.weapons || []).find(x => eq(x.name, w.name));
    if (!pw) {
      const anyMode = (j.weapons || []).some(x => eq(x.name.replace(/\s*[(-].*$/, ''), w.name));
      if (anyMode) continue;
      log.push(`ADD weapon ${w.name} ${w.range}|${w.type}|${w.s}|${w.ap}|${w.d}|${w.abilities}`);
      j.weapons.push({ name: w.name, range: w.range, type: w.type, s: w.s, ap: w.ap, d: w.d, abilities: w.abilities || '-' }); dirty = true; continue;
    }
    for (const k of ['range', 'type', 's', 'ap', 'd']) if (!sameStat(pw[k], w[k]) && w[k] !== '') { log.push(`weapon ${w.name} ${k}: ${pw[k]} -> ${w[k]}`); pw[k] = w[k]; dirty = true; }
    if (!sameAb(pw.abilities, w.abilities || '-')) { log.push(`weapon ${w.name} abilities: ${pw.abilities} -> ${w.abilities}`); pw.abilities = w.abilities || '-'; dirty = true; }
  }
  const eqSheet = s.equipped.map(n).join(' ');
  const norm2 = t => n(t).toLowerCase().replace(/ is a single (model|character) and (is )?equipped with| is equipped with| and is equipped with|[;,.\s]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (eqSheet && norm2(eqSheet) !== norm2(j.equipped_with || '')) {
    // Apply the sheet's sentence only when every item in it is a weapon we really have; the engine
    // finds the default loadout by NAME, so a typo or an unknown item would drop or invent a weapon.
    const items = [...eqSheet.matchAll(/equipped with:?\s*([^.]*)/gi)].flatMap(m => m[1].split(/;|,/))
      .map(x => n(x).replace(/^(\d+|two|three|four)\s+/i, '').replace(/^an? /i, '').replace(/\.$/, '')).filter(x => x && x !== '-');
    const have = x => (j.weapons || []).some(w => {
      const wn = n(w.name).toLowerCase().replace(/\s*[(-].*$/, ''), xn = x.toLowerCase();
      return wn === xn || wn + 's' === xn || wn === xn.replace(/s$/, '') || wn === xn.replace(/ies$/, 'y');
    });
    const missing = items.filter(x => !have(x));
    if (!process.argv.includes('--equipped') || missing.length)
      log.push(`REVIEW equipped_with${missing.length ? ' (unknown item: ' + missing.join(', ') + ')' : ''}\n      sheet: ${eqSheet}\n      ours : ${j.equipped_with}`);
    else { log.push(`equipped_with -> ${eqSheet}`); j.equipped_with = eqSheet; dirty = true; }
  }
  if (log.length) { console.log(`\n## ${j.name}  (${path.basename(f)})`); log.forEach(l => console.log('   ' + l)); changes += log.filter(l => !l.startsWith('REVIEW')).length; }
  if (dirty && write) fs.writeFileSync(f, JSON.stringify(j, null, 2) + '\n');
}
console.log(`\n${changes} change(s)${write ? ' written' : ' (dry run)'}`);
