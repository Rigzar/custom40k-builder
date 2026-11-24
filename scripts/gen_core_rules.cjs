/**
 * Core Rules glossary, generated from the rulebook.
 *
 * Reads the two glossary sections of Codex/Custom40k Core Rules.docx (Heading 4 = the rule's name, the paragraphs
 * below it = its text):
 *   Special Rules > Model abilities   -> modelAbilities
 *   Special Rules > Weapon abilities  -> weaponAbilities
 * and writes src/data/coreRules.generated.json. Nothing in the app reads that file yet: scripts/check_core_rules_drift.ts
 * compares it with the hand-written glossary in src/data/coreRules.ts and lists every rule whose text differs.
 *
 * CHANGELOG: every run that finds a rule added, removed or reworded appends a dated entry to
 * docs/core-rules-changelog.md (what the rule said before and after). A run that finds nothing changes no file.
 *
 *   node scripts/gen_core_rules.cjs                       # the default Codex/Custom40k Core Rules.docx
 *   node scripts/gen_core_rules.cjs "<file.docx>"         # another copy (e.g. an older version)
 *   node scripts/gen_core_rules.cjs --date 2026-11-24     # date for the changelog entry (default: today)
 *
 * Codex rules are NOT touched here: a faction's own rule (Gauss, Tesla, Synapse...) lives in its codex and the codex
 * overrides the Core Rules (Core Rules FAQ 5: "Specific rules from the Codex override general rules from the Core
 * Rules"). Those stay in CODEX_WEAPON_ABILITIES / FACTION_SIGNATURE_RULES.
 *
 * No dependencies: a .docx is a zip, read here with node's own zlib (the .docx converter next to it needs PowerShell,
 * which the GitHub runner does not have).
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const args = process.argv.slice(2);
const dateIdx = args.indexOf('--date');
const date = dateIdx >= 0 ? args[dateIdx + 1] : new Date().toISOString().slice(0, 10);
const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--date') || 'Codex/Custom40k Core Rules.docx';
const OUT = 'src/data/coreRules.generated.json';
const LOG = 'docs/core-rules-changelog.md';

/** The bytes of one file inside a .docx (zip) */
function readZipEntry(buf, wanted) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('not a zip file');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('bad central directory');
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32);
    const localAt = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    if (name === wanted) {
      const dataAt = localAt + 30 + buf.readUInt16LE(localAt + 26) + buf.readUInt16LE(localAt + 28);
      const raw = buf.subarray(dataAt, dataAt + csize);
      return method === 0 ? raw : zlib.inflateRawSync(raw);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(wanted + ' not found in the zip');
}

const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

function paragraphs(xml) {
  return [...xml.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)].map(m => {
    const p = m[0];
    return {
      style: (p.match(/<w:pStyle w:val="([^"]+)"/) || [])[1] || '',
      text: decode([...p.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g)].map(x => x[1]).join('')).replace(/\s+/g, ' ').trim(),
    };
  });
}

function generate(docx) {
  const ps = paragraphs(readZipEntry(fs.readFileSync(docx), 'word/document.xml').toString('utf8'));
  const version = (ps.map(p => p.text).find(t => /^Rules version/i.test(t)) || '').match(/Rules version ([\d.]+)(?:, Balance version ([\d.]+))?/i) || [];
  const out = { rulesVersion: version[1] || '', balanceVersion: version[2] || '', modelAbilities: {}, weaponAbilities: {} };
  // The glossary is the Heading1 "Special Rules" up to the next Heading1. Inside it the Heading2 says which list we are in.
  const start = ps.findIndex(p => /^Heading1$/.test(p.style) && p.text === 'Special Rules');
  if (start < 0) throw new Error('"Special Rules" heading not found: the rulebook layout changed, this script needs a look');
  let list = null, current = null;
  for (let i = start + 1; i < ps.length; i++) {
    const p = ps[i];
    if (/^Heading1$/.test(p.style)) break;
    if (/^Heading2$/.test(p.style)) {
      list = p.text === 'Model abilities' ? out.modelAbilities : p.text === 'Weapon abilities' ? out.weaponAbilities : null; current = null;
      // "Objective secured!" is written as a Heading 2 of its own (a model ability with the heading level of a list): its text follows.
      if (/^Objective secured/i.test(p.text)) { list = out.modelAbilities; current = p.text; list[current] = []; }
      continue;
    }
    if (/^Heading3$/.test(p.style)) { current = null; continue; }
    if (/^Heading4$/.test(p.style) && list) { current = p.text; list[current] = []; continue; }
    if (current && p.text) list[current].push(p.text);
  }
  for (const list2 of [out.modelAbilities, out.weaponAbilities]) for (const k of Object.keys(list2)) list2[k] = list2[k].join(' ');
  return out;
}

const fresh = generate(file);
if (Object.keys(fresh.weaponAbilities).length < 30 || Object.keys(fresh.modelAbilities).length < 40) {
  throw new Error(`suspiciously few rules (${Object.keys(fresh.weaponAbilities).length} weapon, ${Object.keys(fresh.modelAbilities).length} model): not writing anything`);
}
const before = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;

const changes = [];
if (before) {
  for (const [label, key] of [['Weapon ability', 'weaponAbilities'], ['Model ability', 'modelAbilities']]) {
    const a = before[key] || {}, b = fresh[key];
    for (const n of Object.keys(b)) {
      if (!(n in a)) changes.push(`- **${label} added: ${n}**\n  - ${b[n]}`);
      else if (a[n] !== b[n]) changes.push(`- **${label} changed: ${n}**\n  - before: ${a[n]}\n  - after: ${b[n]}`);
    }
    for (const n of Object.keys(a)) if (!(n in b)) changes.push(`- **${label} removed: ${n}**`);
  }
}

const same = before && JSON.stringify(before) === JSON.stringify(fresh);
if (!same) fs.writeFileSync(OUT, JSON.stringify(fresh, null, 2) + '\n');
if (before && changes.length) {
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  const head = '# Core Rules changelog (generated)\n\nEvery time `scripts/gen_core_rules.cjs` finds a rule added, removed or reworded in the Core Rules glossary (Special Rules: model and weapon abilities), it appends an entry here.\nNewest entry last.\n';
  const old = fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : head;
  const title = `${date} — Core Rules ${before.rulesVersion || '?'} → ${fresh.rulesVersion || '?'}`;
  fs.writeFileSync(LOG, old.replace(/\s*$/, '\n') + `\n## ${title}\n\n${changes.join('\n')}\n`);
}
console.log(`Core Rules ${fresh.rulesVersion} (balance ${fresh.balanceVersion}): ${Object.keys(fresh.weaponAbilities).length} weapon abilities, ${Object.keys(fresh.modelAbilities).length} model abilities.`);
console.log(!before ? `first run: wrote ${OUT}, nothing to compare with` : changes.length ? `${changes.length} change(s) since the previous run, logged in ${LOG}` : 'no change since the previous run');
