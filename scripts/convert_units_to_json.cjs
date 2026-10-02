/**
 * Convert one faction's unit files from TypeScript to pure JSON, and rebuild its index.
 *
 *   node scripts/convert_units_to_json.cjs <faction>             # dry run: report only
 *   node scripts/convert_units_to_json.cjs <faction> --write     # convert
 *
 * WHY. Unwise (the codex author's collaborator) updates the data automatically from the sheets,
 * and can only do that to a file that is 100% JSON. A unit file was a header comment, an `import`,
 * and `export const x: Unit = { ...json... };` — so the `.ts` wrapper is the only thing standing
 * between his tooling and the data. "If the import and export lines are gone your file is 100% a
 * json ... could you make a different file with import/export and leave the main file 100% a json?"
 *
 * WHAT IT DOES.
 *   - each units/<slot>/<name>.ts  ->  units/<slot>/<name>.json   (the body, nothing else)
 *   - every per-slot index.ts and the units/index.ts are replaced by ONE units/index.ts that
 *     imports the JSON files and exports `faction`, `slot_to_units` and `units` exactly as before,
 *     so the loader needs no change.
 *
 * WHAT IT REFUSES TO DO. A file is converted only if its body parses as JSON AFTER the two
 * harmless normalisations below. Anything else is listed and left as .ts — a conversion that loses
 * a comment or a computed value would be silent, and silent is the failure this guards against.
 *
 * The two normalisations, both lossless: a BOM is dropped, and a trailing comma (legal in
 * TypeScript, illegal in JSON) is removed.
 *
 * The header comment is DROPPED. It is the boilerplate "SOURCE: TODO - add canonical datasheet
 * text here" stub, and a dry run lists any file whose header says something else, so real audit
 * notes are never discarded without being seen.
 */
const fs = require('fs');
const path = require('path');

const faction = process.argv[2];
const write = process.argv.includes('--write');
// --lenient: a body that is not literal JSON (comments, unquoted keys, a shared constant spread
// in) is LOADED instead of parsed, and the VALUE is written out. Run it under tsx
// (`npx tsx scripts/convert_units_to_json.cjs <faction> --lenient --write`) so the unit's own
// imports resolve. The caller must diff the loaded data before and after.
const lenient = process.argv.includes('--lenient');
if (!faction) { console.error('usage: node scripts/convert_units_to_json.cjs <faction> [--write]'); process.exit(1); }

const unitsDir = path.join('data', 'parsed', faction, 'units');
if (!fs.existsSync(unitsDir)) { console.error(`no existe ${unitsDir}`); process.exit(1); }

const STUB = /SOURCE:\s*TODO/i;

/** Remove trailing commas outside of strings — `,` followed by `]` or `}`. */
function stripTrailingCommas(src) {
  let out = '';
  let inStr = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      out += c;
      if (c === '\\') { out += src[++i] ?? ''; continue; }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; out += c; continue; }
    if (c === ',') {
      let j = i + 1;
      while (j < src.length && /\s/.test(src[j])) j++;
      if (src[j] === ']' || src[j] === '}') continue;   // drop it
    }
    out += c;
  }
  return out;
}

const converted = [];
const refused = [];
const realHeaders = [];
const headerText = {};

const slots = fs.readdirSync(unitsDir, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);

// name -> { slot, file, exportName }
const catalogue = [];

/*
 * The KEY each unit is registered under comes from the OLD index, not from the unit's own
 * `name` field. They are not always the same: when this was written the Tyranid fortification
 * was registered as "Sporecyst" (the key slots.ts and unit-types.ts looked it up by) while its
 * data said "Sporocyst". Keying by the inner name silently renamed it, every lookup by the old key
 * came back empty, and the profile snapshot caught it as six changed lines. A format conversion
 * must not change a single key.
 *
 * (That particular mismatch was corrected afterwards, deliberately and with a rename map for saved
 * lists — see RENAMED_UNITS in unitRenames.ts. Any OTHER faction may still carry one, which is why
 * the converter reports every kept key.)
 */
const oldKeyByExport = {};
{
  const old = fs.readFileSync(path.join(unitsDir, 'index.ts'), 'utf8').replace(/^﻿/, '');
  for (const m of old.matchAll(/^\s*"([^"]+)"\s*:\s*(\w+)\.(\w+)\s*,?\s*$/gm))
    oldKeyByExport[`${m[2]}.${m[3]}`] = m[1];
}
const camel = s => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const slotNs = s => camel(s);   // dedicated_transport -> dedicatedTransport, as the old index named them

for (const slot of slots) {
  const dir = path.join(unitsDir, slot);
  for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.ts') && n !== 'index.ts').sort()) {
    const full = path.join(dir, f);
    const raw = fs.readFileSync(full, 'utf8').replace(/^﻿/, '');
    const m = raw.match(/export\s+const\s+(\w+)\s*:\s*Unit\s*=\s*([\s\S]*?);?\s*$/);
    if (!m) { refused.push([full, 'no tiene "export const x: Unit = ..."']); continue; }

    const before = raw.slice(0, raw.indexOf(m[0]));
    const header = (before.match(/\/\*[\s\S]*?\*\//) ?? [''])[0];
    const residue = before
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
      .replace(/\/\/.*$/gm, '')
      .trim();
    if (residue && !lenient) { refused.push([full, `código fuera del objeto: ${residue.slice(0, 50)}`]); continue; }
    if (header && !STUB.test(header)) { realHeaders.push(full); headerText[full] = header; }

    let body;
    try { body = JSON.parse(stripTrailingCommas(m[2])); }
    catch (e) {
      if (!lenient) { refused.push([full, `el cuerpo no es JSON: ${String(e.message).slice(0, 60)}`]); continue; }
      try { body = JSON.parse(JSON.stringify(require(path.resolve(full))[m[1]])); }
      catch (e2) { refused.push([full, `ni siquiera se puede cargar: ${String(e2.message).slice(0, 60)}`]); continue; }
    }

    // The registration key: what the OLD index called this export, falling back to the unit's own
    // name only for a unit the old index did not list.
    const key = oldKeyByExport[`${slotNs(slot)}.${m[1]}`] ?? body.name;
    if (key !== body.name)
      console.log(`   clave conservada: "${key}" (el dato interno dice "${body.name}")  ${full.replace(/\\/g, '/')}`);

    converted.push({ full, body, slot, exportName: m[1], name: key, file: f.replace(/\.ts$/, '.json') });
    catalogue.push({ slot, name: key, file: f.replace(/\.ts$/, '.json') });
  }
}

console.log(`${faction}: ${converted.length} convertibles, ${refused.length} rechazadas`);
for (const [f, why] of refused) console.log(`   RECHAZADA ${f.replace(/\\/g, '/')}  —  ${why}`);
if (realHeaders.length) {
  console.log(`\n${realHeaders.length} cabecera(s) con algo distinto del aviso "TODO" — se PERDERIAN:`);
  for (const f of realHeaders) console.log(`   ${f.replace(/\\/g, '/')}`);
}

if (!write) { console.log('\n(simulacro: no se ha escrito nada)'); process.exit(refused.length ? 2 : 0); }
if (refused.length) { console.error('\nHay ficheros rechazados: no escribo nada. Arréglalos primero.'); process.exit(2); }

// ── write ─────────────────────────────────────────────────────────────────────
/*
 * Keep the OLD index's key order. `units` is a plain object whose iteration order drives anything
 * that lists units, and "same keys, different order" is exactly the kind of change a format
 * conversion must not make. Units the old index did not list go last, in folder order.
 */
const oldOrder = Object.values(oldKeyByExport);
catalogue.sort((a, b) => {
  const ia = oldOrder.indexOf(a.name), ib = oldOrder.indexOf(b.name);
  return (ia < 0 ? 1e9 : ia) - (ib < 0 ? 1e9 : ib);
});

// The original index.ts carries `faction` and the slot_to_units mapping; keep them verbatim.
const oldIndex = fs.readFileSync(path.join(unitsDir, 'index.ts'), 'utf8').replace(/^﻿/, '');
const factionLine = (oldIndex.match(/export const faction\s*[:=][^;]*;/) ?? [])[0];
const s2u = (oldIndex.match(/export const slot_to_units[\s\S]*?\n\};/) ?? [])[0];
if (!factionLine || !s2u) { console.error('no se pudo leer faction / slot_to_units del index.ts original'); process.exit(3); }

const ident = (slot, file) => `${slot}_${file.replace(/\.json$/, '')}`.replace(/[^A-Za-z0-9_]/g, '_');

const imports = catalogue.map(c => `import ${ident(c.slot, c.file)} from './${c.slot}/${c.file}';`);
const entries = catalogue.map(c => `  ${JSON.stringify(c.name)}: ${ident(c.slot, c.file)} as Unit,`);

const indexTs = `/**
 * ${faction} - unit index.
 *
 * Each unit is a PURE JSON file next to this one, so the codex tooling can rewrite it from the
 * sheets without touching any TypeScript. This is the only .ts in the folder: it imports them
 * and exports \`faction\`, \`slot_to_units\` and \`units\` exactly as the old per-slot indexes did.
 *
 * Generated by scripts/convert_units_to_json.cjs. To add a unit, add its .json and one line here.
 */

import type { Unit } from '../../../../src/types/data';

${imports.join('\n')}

${factionLine}

${s2u}

/** All units keyed by name. */
export const units: Record<string, Unit> = {
${entries.join('\n')}
};
`;

// A header that is not the TODO stub is real audit/rule notes. JSON cannot hold a comment, so keep
// them next to the units instead of throwing them away.
if (realHeaders.length) {
  const NL = String.fromCharCode(10);
  const strip = h => h.split(NL)
    .map(l => l.replace(/^[ \t]*(\/\*+|\*+\/|\*)[ ]?/, '').replace(/[ \t]*\*+\/[ \t]*$/, ''))
    .join(NL).trim();
  const notes = realHeaders.map(f =>
    '## ' + path.relative(unitsDir, f).split(path.sep).join('/').replace(/[.]ts$/, '.json') + NL + NL + strip(headerText[f]) + NL);
  fs.writeFileSync(path.join('data', 'parsed', faction, 'unit-notes.md'),
    '# ' + faction + ' - notes kept from the unit files' + NL + NL +
    'These were the header comments of the old .ts unit files. The unit files are pure JSON now, which cannot carry a comment.' +
    NL + NL + notes.join(NL));
}

// Write the JSON first, then the new index; only then remove the old files, so a failure part-way
// leaves the original .ts in place and the app still loads.
const tmpWrites = [];
for (const c of converted) {
  const target = path.join(path.dirname(c.full), c.file);
  fs.writeFileSync(`${target}.tmp`, JSON.stringify(c.body, null, 2) + '\n');
  tmpWrites.push([`${target}.tmp`, target]);
}
fs.writeFileSync(path.join(unitsDir, 'index.ts.tmp'), indexTs);
tmpWrites.push([path.join(unitsDir, 'index.ts.tmp'), path.join(unitsDir, 'index.ts')]);

for (const [tmp, target] of tmpWrites) fs.renameSync(tmp, target);
for (const c of converted) fs.unlinkSync(c.full);
for (const slot of slots) {
  const idx = path.join(unitsDir, slot, 'index.ts');
  if (fs.existsSync(idx)) fs.unlinkSync(idx);
}
console.log(`\nescritos ${converted.length} .json y units/index.ts; borrados los .ts antiguos`);
