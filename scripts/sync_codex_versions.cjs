/**
 * Reads the live title of every faction's Google Sheet (the author records the codex version in
 * it, e.g. "Chaos Space Marines 1.05"), compares the number with the `version:` in
 * src/data/factionCatalog.ts and REWRITES the catalog when a codex moved. Prints a markdown
 * report. The sheet ids come from the SHEETS table in scripts/fetch_codex.cjs, so there is one
 * list to maintain.
 *
 *   node scripts/sync_codex_versions.cjs            → rewrite the catalog, report what moved
 *   node scripts/sync_codex_versions.cjs --dry      → report only
 *
 * It changes the version LABEL only. Whether the unit data really follows that version is what
 * the unit-update pull request is for; the Inquisitor panel's per-faction override (stored in the
 * database) still wins over this default at run time.
 */
const fs = require('fs');
const { execSync } = require('child_process');

const dry = process.argv.includes('--dry');
const fetchSrc = fs.readFileSync('scripts/fetch_codex.cjs', 'utf8');
const table = fetchSrc.slice(fetchSrc.indexOf('const SHEETS = {'), fetchSrc.indexOf('};', fetchSrc.indexOf('const SHEETS = {')));
const ids = {};
for (const m of table.matchAll(/^\s*([a-z_]+):\s*\['([A-Za-z0-9_-]+)'/gm)) ids[m[1]] = m[2];

const catPath = 'src/data/factionCatalog.ts';
let cat = fs.readFileSync(catPath, 'utf8');
const crlf = cat.includes('\r\n');
const NOT_CANON = new Set(['tyranids_test', 'psychic']);

const liveTitle = (id) => {
  try {
    const head = execSync(`curl -sIL --max-time 30 "https://docs.google.com/spreadsheets/d/${id}/export?format=ods"`,
      { encoding: 'utf8', maxBuffer: 1 << 22 });
    const m = head.match(/filename\*?=(?:UTF-8''|")?([^";\r\n]+)/i);
    return m ? decodeURIComponent(m[1]).replace(/\.ods$/i, '') : null;
  } catch { return null; }
};

const moved = [], same = [], unknown = [];
for (const [key, id] of Object.entries(ids)) {
  if (NOT_CANON.has(key)) continue;
  const row = new RegExp(`(key: '${key}',[^\\n]*?version: ')(\\d+\\.\\d+)(')`);
  const m = cat.match(row);
  if (!m) { unknown.push(key); continue; }
  const title = liveTitle(id);
  const live = title && title.match(/(\d+\.\d+)\s*$/)?.[1];
  if (!live) { unknown.push(`${key} (no version in the title "${title}")`); continue; }
  if (live === m[2]) { same.push(key); continue; }
  moved.push(`${key}: ${m[2]} → ${live}  ("${title}")`);
  if (!dry) cat = cat.replace(row, `$1${live}$3`);
}
if (moved.length && !dry) fs.writeFileSync(catPath, crlf && !cat.includes('\r\n') ? cat.replace(/\n/g, '\r\n') : cat);

const out = ['\n## Codex versions'];
out.push(moved.length ? `${dry ? 'Would move' : 'Moved'} in src/data/factionCatalog.ts:` : 'Every codex version already matches the sheet titles.');
moved.forEach(x => out.push(`- ${x}`));
if (unknown.length) { out.push('\nCould not check:'); unknown.forEach(x => out.push(`- ${x}`)); }
console.log(out.join('\n'));
