/**
 * Fetch the author's canonical Google Sheets and compare them with our local `Codex/` copies.
 *
 * The sheet ids come from the hyperlink table inside `Codex/Custom40k Core Rules.docx` — every
 * faction is published there, world-readable, and Google exports any of them as .ods from
 * `/export?format=ods`. Extracted 2026-08-15; re-read that doc if a link ever moves.
 *
 *   node scripts/fetch_codex.cjs                 → download all, report which differ from Codex/
 *   node scripts/fetch_codex.cjs necrons eldar   → only those
 *   node scripts/fetch_codex.cjs --apply necrons → ALSO overwrite Codex/ with the fresh copy
 *
 * `--apply` is deliberately opt-in and per-faction: replacing a .ods means that faction is
 * un-audited again and owes a full cell-by-cell re-audit (see CLAUDE.md). Never bulk-apply.
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/** key → [google sheet id, local filename in Codex/ (null = we hold no copy)] */
const SHEETS = {
  psychic:            ['1s4SvAC1hoqm1X3DHtQspMHzkvaGVvTKBYGTDDovXFqc', 'General psychic disciplines.ods'],
  adeptus_custodes:   ['1Ic420krL5mcf3_E_vwmwLnGoT1hZ9Qzl0IxWeJ79yoI', 'Adeptus Custodes 1.01.ods'],
  adeptus_mechanicus: ['1uufTN0BOMRNtjSWfFJzEtfXUmpHdU8WTdKDUoXNLs8w', 'Adeptus Mechanicus 1.01.ods'],
  adeptus_sororitas:  ['1t6sB5Ls5UdXu5LE61Ab_2OOgxD4m2TC6hFvsEy0bP3k', 'Adeptus Sororitas 1.01.ods'],
  assassins:          ['1NZepq8IfXgWs9mmZMxg4emgOxTPP5VfVNfRZ3ryh5f4', 'Assassins 1.01.ods'],
  chaos_daemons:      ['1t4UjzvS44a2h-x5KJGM-GyIou66yt0XfpOqqjAE1zl8', 'Chaos Daemons 1.01.ods'],
  chaos_space_marines:['1Tj4zAtpprqI2W5VeIoV_HsuzhX_3XGhDMMgM2axOiBw', 'Chaos Space Marines 1.05.ods'],
  dark_eldar:         ['1SGc2WinOPa4gy66gICT4KiczzOgugDMe-v5JGz-bPQ8', 'Dark Eldar 1.01.ods'],
  eldar:              ['139EqmDtxDjDZ4t6tllqHKjATrTpKQgJks7UzmKkUSkw', 'Eldar 1.02.ods'],
  genestealer_cults:  ['1s0RwILJINi2QcCYnpjQ8und3QRoTDZWp83UJGlo8hqQ', 'Genestealer Cults 1.02.ods'],
  grey_knights:       ['1XkDkdshwkySGDwBaF4sQblDcE4xITkm1iSSlZSUE_mk', 'Grey Knights 1.01.ods'],
  harlequins:         ['1E_9Vy6kWaAUXVBV-BiyJK4GD7_r72cYwEa115_G2Dec', 'Harlequins 1.01.ods'],
  // Was "Legio Titanicus"; the author renamed it in the 2026-08 codex and moved the Secutarii,
  // Tech-thralls, Macrocarid and Triaros into it. Same workbook, same id — only the title moved,
  // so there is no separate "Forces of the Machine God" file to look for.
  legio_titanicus:    ['1SrBhi_8b77QwqoI03xNDxgOwgt-ePmqRQvA5dyquYtM', 'Horus Heresy Forces of the Machine God Supplement 1.01.ods'],
  horus_heresy:       ['1vRRoUGkH3HhzZYQk6_3Hp0pSlWGWb9BKaz3VrYfYmFU', 'Horus Heresy Legiones Astartes Supplement 1.0.ods'],
  imperial_guard:     ['1nii7VyPLnNHlRlpJTxsh79P7qo1WT3D-yJM0g88CbZM', 'Imperial Guard 1.05.ods'],
  inquisition:        ['1krDncaF0CSf6bDIeA-j20dAo3tqkphkeDd2weq56MN4', 'Inquisition 1.01.ods'],
  leagues_of_votann:  ['1lZ6MxdCM710N-d4ba9RUSdhmeN8iJjzM5hlpVf73iPY', 'Leagues of Votann 1.02.ods'],
  necrons:            ['1hkc7MKcM4NrWr3GWIKcF9lYBx55CfQ9pBI6srKuzwOA', 'Necrons 1.11.ods'],
  orks:               ['1gt2q98cnPczVyaujVWX56r2F_GJXBFp8IW9VpAWZ6qI', 'Orks 1.03.ods'],
  space_marines:      ['16Ri3G9Jx1NAzguMbTKtxsL8uaOq6hik3h7NVuU85mZA', 'Space Marines 1.05.ods'],
  tau_empire:         ['1S1Uub6VvvlBuxlqh61S5DhZYIKtdRHvkRs1CsIRgu8s', 'Tau Empire 1.02.ods'],
  // The Core Rules doc links two Tyranid workbooks. The live one has 46 tabs and a normal Index;
  // the other has 40 and opens with "Designer's notes" — that is the author's test copy, not canon.
  tyranids:           ['1Os-J6QK4quRtd0K6ocOsbaRMHd7PimPaQpRZw8kR_5M', 'Tyranids 1.08.ods'],
  tyranids_test:      ['1-oox_d8xDqNM7hlMKLey1779tDGhUPpPJ3KeHRusGqA', null],
  escalation:         ['1i9o9KowRslsN4e1UXjzqME5OzcH5A9nR78LjvTVwXRY', 'Escalation.ods'],
};

const CACHE = '.codex-live';
const args = process.argv.slice(2);
const apply = args.includes('--apply');
const wanted = args.filter(a => !a.startsWith('--'));
const keys = wanted.length ? wanted : Object.keys(SHEETS);

/**
 * The live document's TITLE, which is where the author records the codex version — Google returns
 * it as the export's Content-Disposition filename.
 *
 * Content and title move independently, and comparing only content missed three version bumps
 * (Imperial Guard 1.03→1.04, Genestealer Cults 1.01→1.02, Tyranids 1.02→1.05, all reported by the
 * user 2026-08-18): a `--apply` writes fresh content under the OLD local filename, so the cells
 * match forever while the version label silently rots. Always compare both.
 */
const liveTitle = (id) => {
  try {
    const head = execSync(
      `curl -sIL --max-time 30 "https://docs.google.com/spreadsheets/d/${id}/export?format=ods"`,
      { encoding: 'utf8', maxBuffer: 1 << 22 });
    const m = head.match(/filename\*?=(?:UTF-8''|")?([^";\r\n]+)/i);
    // The header strips spaces out of the name, so compare on alphanumerics only.
    return m ? decodeURIComponent(m[1]).replace(/\.ods$/i, '') : null;
  } catch { return null; }
};
const sameTitle = (a, b) => a != null && b != null
  && a.replace(/[^a-z0-9.]/gi, '').toLowerCase() === b.replace(/[^a-z0-9.]/gi, '').toLowerCase();

const rows = (wb) => {
  const o = {};
  for (const n of wb.SheetNames) {
    o[n] = XLSX.utils.sheet_to_csv(wb.Sheets[n], { blankrows: false })
      .split('\n').map(r => r.replace(/,+$/, '').trim()).filter(Boolean);
  }
  return o;
};

/**
 * Sheets that exist but are NOT canon, so a plain run says nothing about them.
 *
 * `tyranids_test` is the author's own working copy (40 tabs opening with "Designer's notes" against
 * the live book's 46). It appeared as a new sheet on every run and would have trained us to skim
 * past this output — the same way the phantom-weapon guard's noise hid a real bug. Rigzar, asked:
 * *"ignora tyranid test"*. Name it explicitly on the command line if you ever do want to look.
 */
const NOT_CANON = new Set(['tyranids_test']);

fs.mkdirSync(CACHE, { recursive: true });
const explicit = args.filter(a => !a.startsWith('--'));
for (const key of keys) {
  if (NOT_CANON.has(key) && !explicit.includes(key)) continue;
  const entry = SHEETS[key];
  if (!entry) { console.log(`?  ${key} — unknown, see SHEETS in this file`); continue; }
  const [id, local] = entry;
  const dest = path.join(CACHE, `${key}.ods`);
  try {
    execSync(`curl -sL --max-time 120 -o "${dest}" "https://docs.google.com/spreadsheets/d/${id}/export?format=ods"`, { stdio: 'pipe' });
  } catch { console.log(`❌ ${key} — download failed`); continue; }
  if (!fs.existsSync(dest) || fs.readFileSync(dest).slice(0, 2).toString('latin1') !== 'PK') {
    console.log(`❌ ${key} — not a spreadsheet (sheet probably not public any more)`);
    continue;
  }
  if (!local) { console.log(`🆕 ${key} — downloaded, no local counterpart`); continue; }
  const localPath = path.join('Codex', local);
  if (!fs.existsSync(localPath)) { console.log(`🆕 ${key} — no local copy at ${local}`); continue; }

  // Version label first — a bump here is a real codex release even when no cell moved.
  const title = liveTitle(id);
  const localTitle = local.replace(/\.ods$/i, '');
  const titleMoved = title && !sameTitle(title, localTitle);
  if (titleMoved) console.log(`📛 ${key} — VERSION BUMPED: live "${title}" vs local "${localTitle}"`);

  const A = rows(XLSX.readFile(localPath)), B = rows(XLSX.readFile(dest));
  const nw = Object.keys(B).filter(s => !A[s]);
  const gone = Object.keys(A).filter(s => !B[s]);
  const changed = Object.keys(B).filter(s => {
    if (!A[s]) return false;
    const sa = new Set(A[s]), sb = new Set(B[s]);
    return B[s].some(l => !sa.has(l)) || A[s].some(l => !sb.has(l));
  });
  if (!nw.length && !gone.length && !changed.length) {
    console.log(titleMoved
      ? `⚠️  ${key} — cells identical, but rename Codex/${local} → "${title}.ods" and update the version badge`
      : `✅ ${key} — identical`);
    continue;
  }
  console.log(`🔄 ${key}`);
  if (nw.length)   console.log(`     new tabs    : ${nw.join(', ')}`);
  if (gone.length) console.log(`     tabs removed: ${gone.join(', ')}`);
  if (changed.length) console.log(`     tabs changed: ${changed.join(', ')}`);
  if (apply) {
    fs.copyFileSync(dest, localPath);
    console.log(`     ⇒ copied over Codex/${local} — this faction is now UN-AUDITED, owes a full pass`);
  }
}
