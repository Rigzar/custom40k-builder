/**
 * Checks what UnwiseGetData/update_units.py just did to data/parsed/<faction>/units/**.json,
 * comparing the working tree with HEAD, and prints a markdown report (it is pasted into the pull
 * request by .github/workflows/update-units.yml). Exit code 1 = at least one BLOCKING problem.
 *
 *   node scripts/check_unit_update.cjs            (run it after update_units.py, before committing)
 *
 * BLOCKING (each one has already broken the live site once — see the history of GH#194 and the
 * wiki build): a file that is no longer valid JSON · an `abilities` entry that is not a string
 * (the sheet's tables / power blocks get flattened into numbers) · a unit that lost its
 * `variant_models` key (the wiki template reads `.length` of it) · a unit with no models or a
 * size/cost of zero.
 *
 * REVIEW (reported, never blocking — a real sheet edit looks exactly the same): a squad's model
 * names / min / max / default size changed · min cost changed · files added or removed.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');

// git is started directly with an argument list, never through a shell: the file names below come
// from the repository and may contain anything.
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['pipe', 'pipe', 'ignore'] });
const changed = git('-c', 'core.quotepath=false', 'status', '--porcelain', '--untracked-files=all', '--', 'data/parsed')
  .split('\n').filter(Boolean)
  .map(l => ({ st: l.slice(0, 2).trim(), file: l.slice(3).replace(/^"|"$/g, '') }))
  .filter(x => /units\/.*\.json$/.test(x.file));

const structure = u => JSON.stringify([u.default_size, (u.models || []).map(m => [m.name, m.min, m.max]), (u.variant_models || []).length]);
const blocking = [], review = [], added = [], removed = [], details = [];

/** What changed inside one unit, as short lines: stats and points per model, weapon profiles,
 *  abilities, the "equipped with" sentence, keywords, unit type. */
function diffUnit(o, n) {
  const out = [];
  const byName = (arr) => new Map((arr || []).map(x => [x.name, x]));
  const models = (key) => {
    const A = byName(o[key]), B = byName(n[key]);
    const label = key === 'models' ? 'model' : 'variant';
    for (const [name, m] of B) {
      const p = A.get(name);
      if (!p) { out.push(`${label} added: ${name}`); continue; }
      if (p.points !== m.points) out.push(`${name}: points ${p.points} → ${m.points}`);
      for (const k of new Set([...Object.keys(p.stats || {}), ...Object.keys(m.stats || {})]))
        if ((p.stats || {})[k] !== (m.stats || {})[k]) out.push(`${name}: ${k} ${(p.stats || {})[k]} → ${(m.stats || {})[k]}`);
    }
    for (const name of A.keys()) if (!B.has(name)) out.push(`${label} removed: ${name}`);
  };
  models('models'); models('variant_models');
  const W = byName(o.weapons), V = byName(n.weapons);
  for (const [name, w] of V) {
    const p = W.get(name);
    if (!p) { out.push(`weapon added: ${name}`); continue; }
    for (const k of ['range', 'type', 's', 'ap', 'd', 'abilities'])
      if (p[k] !== w[k]) out.push(`${name}: ${k} ${p[k]} → ${w[k]}`);
  }
  for (const name of W.keys()) if (!V.has(name)) out.push(`weapon removed: ${name}`);
  const aOld = new Set(o.abilities || []), aNew = new Set(n.abilities || []);
  const aAdd = [...aNew].filter(x => !aOld.has(x)).length, aGone = [...aOld].filter(x => !aNew.has(x)).length;
  if (aAdd || aGone) out.push(`abilities: ${aAdd} new or reworded, ${aGone} removed or reworded`);
  if ((o.equipped_with || '') !== (n.equipped_with || '')) out.push('equipped with: sentence changed');
  if (o.unit_type !== n.unit_type) out.push(`unit type ${o.unit_type} → ${n.unit_type}`);
  if (JSON.stringify(o.keywords) !== JSON.stringify(n.keywords)) out.push('keywords changed');
  return out;
}
let pointsOnly = 0;

for (const { st, file } of changed) {
  const short = file.replace('data/parsed/', '').replace('/units/', ' / ');
  if (st === 'D') { removed.push(short); continue; }
  let now;
  try { now = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { blocking.push(`${short}: not valid JSON (${e.message})`); continue; }
  const bad = (now.abilities || []).findIndex(a => typeof a !== 'string');
  if (bad >= 0) blocking.push(`${short}: abilities[${bad}] is ${JSON.stringify((now.abilities || [])[bad])}, not text (a table or power block was flattened)`);
  if (!Array.isArray(now.models) || !now.models.length) blocking.push(`${short}: no models`);
  if (!now.default_size || !now.min_cost) blocking.push(`${short}: default_size ${now.default_size} / min_cost ${now.min_cost}`);
  let old = null;
  try { old = JSON.parse(git('show', `HEAD:${file}`)); } catch { /* new file */ }
  if (!old) { added.push(short); continue; }
  if ('variant_models' in old && !('variant_models' in now)) blocking.push(`${short}: lost the variant_models key`);
  const d = diffUnit(old, now);
  if (d.length) details.push(`**${short}**` + d.slice(0, 12).map(x => `\n  - ${x}`).join('') + (d.length > 12 ? `\n  - … ${d.length - 12} more` : ''));
  if (structure(old) !== structure(now)) {
    review.push(`${short}: models ${structure(old)} → ${structure(now)}`);
  } else if (old.min_cost !== now.min_cost) {
    review.push(`${short}: min cost ${old.min_cost} → ${now.min_cost}`);
  } else pointsOnly++;
}

const out = [];
out.push(`## Unit update check`);
out.push(`${changed.length} unit files differ from main (${pointsOnly} with no change to squad size or cost).`);
const list = (title, a, n = 60) => {
  if (!a.length) return;
  out.push(`\n### ${title} (${a.length})`);
  a.slice(0, n).forEach(x => out.push(`- ${x}`));
  if (a.length > n) out.push(`- … and ${a.length - n} more`);
};
list('BLOCKING — fix before merging', blocking);
list('Squad size / cost changed — compare with the sheet', review);
list('New files (the script normally refuses to add units)', added);
list('Removed files', removed);
if (details.length) {
  out.push(`\n### What changed, unit by unit (${details.length})`);
  let size = out.join('\n').length;
  for (const d of details) {
    if (size + d.length > 55000) { out.push('\n… the rest is in the commit diff.'); break; }
    out.push(d); size += d.length;
  }
}
if (!blocking.length) out.push('\nNo blocking problems.');
console.log(out.join('\n'));
process.exit(blocking.length ? 1 : 0);
